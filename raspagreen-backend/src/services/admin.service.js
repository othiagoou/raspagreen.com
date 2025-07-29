import { supabase } from '../config/database.js'
import logger from '../utils/logger.js'

/**
 * Service para operações administrativas
 */
export class AdminService {

  /**
   * Obter estatísticas gerais da plataforma
   */
  async getGeneralStats() {
    try {
      // Executar consultas em paralelo
      const [usersResult, gamesResult, transactionsResult, categoriesResult] = await Promise.allSettled([
        supabase.from('user_profiles').select('id', { count: 'exact', head: true }),
        supabase.from('game_sessions').select('amount_spent, amount_won'),
        supabase.from('transactions').select('type, amount').eq('status', 'completed'),
        supabase.from('scratch_categories').select('id', { count: 'exact', head: true }).eq('active', true)
      ])

      // Processar resultados
      const totalUsers = usersResult.status === 'fulfilled' ? usersResult.value.count || 0 : 0
      const totalCategories = categoriesResult.status === 'fulfilled' ? categoriesResult.value.count || 0 : 0

      let totalGames = 0
      let totalRevenue = 0
      let totalPayouts = 0

      if (gamesResult.status === 'fulfilled' && gamesResult.value.data) {
        totalGames = gamesResult.value.data.length
        totalRevenue = gamesResult.value.data.reduce((sum, game) => sum + parseFloat(game.amount_spent), 0)
        totalPayouts = gamesResult.value.data.reduce((sum, game) => sum + parseFloat(game.amount_won), 0)
      }

      let depositTotal = 0
      let withdrawTotal = 0

      if (transactionsResult.status === 'fulfilled' && transactionsResult.value.data) {
        transactionsResult.value.data.forEach(transaction => {
          const amount = parseFloat(transaction.amount)
          if (transaction.type === 'deposit') {
            depositTotal += amount
          } else if (transaction.type === 'withdraw') {
            withdrawTotal += amount
          }
        })
      }

      return {
        users: {
          total: totalUsers,
          active_today: 0 // TODO: implementar contagem de usuários ativos
        },
        games: {
          total: totalGames,
          total_revenue: totalRevenue,
          total_payouts: totalPayouts,
          gross_profit: totalRevenue - totalPayouts,
          house_edge: totalRevenue > 0 ? ((totalRevenue - totalPayouts) / totalRevenue * 100).toFixed(2) : 0
        },
        transactions: {
          total_deposits: depositTotal,
          total_withdrawals: withdrawTotal,
          net_deposits: depositTotal - withdrawTotal
        },
        categories: {
          total: totalCategories
        }
      }

    } catch (error) {
      logger.error('Erro no service de estatísticas gerais:', error)
      throw error
    }
  }

  /**
   * Listar usuários com paginação
   */
  async getUsers(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit

      const { data, error, count } = await supabase
        .from('user_profiles')
        .select('*, auth.users!inner(last_sign_in_at)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        logger.error('Erro ao buscar usuários:', error)
        throw new Error('Erro ao buscar usuários')
      }

      return {
        users: data,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }

    } catch (error) {
      logger.error('Erro no service de usuários:', error)
      throw error
    }
  }

  /**
   * Listar categorias com estatísticas
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('scratch_categories')
        .select(`
          *,
          game_sessions(id)
        `)
        .order('created_at', { ascending: false })

      if (error) {
        logger.error('Erro ao buscar categorias:', error)
        throw new Error('Erro ao buscar categorias')
      }

      // Adicionar contagem de jogos
      return data.map(category => ({
        ...category,
        total_games: category.game_sessions?.length || 0,
        game_sessions: undefined // Remover do retorno
      }))

    } catch (error) {
      logger.error('Erro no service de categorias:', error)
      throw error
    }
  }

  /**
   * Criar nova categoria
   */
  async createCategory(categoryData) {
    try {
      const { data, error } = await supabase
        .from('scratch_categories')
        .insert({
          name: categoryData.name,
          slug: categoryData.slug,
          price: categoryData.price,
          max_reward: categoryData.max_reward,
          rtp_percentage: categoryData.rtp_percentage || 85,
          banner_url: categoryData.banner_url || null,
          active: true
        })
        .select()
        .single()

      if (error) {
        logger.error('Erro ao criar categoria:', error)
        throw new Error('Erro ao criar categoria')
      }

      return data

    } catch (error) {
      logger.error('Erro no service de criação de categoria:', error)
      throw error
    }
  }

  /**
   * Atualizar categoria
   */
  async updateCategory(categoryId, updates) {
    try {
      const allowedFields = ['name', 'price', 'max_reward', 'rtp_percentage', 'banner_url', 'active']
      const filteredUpdates = {}

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          filteredUpdates[key] = value
        }
      }

      filteredUpdates.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('scratch_categories')
        .update(filteredUpdates)
        .eq('id', categoryId)
        .select()
        .single()

      if (error) {
        logger.error('Erro ao atualizar categoria:', error)
        throw new Error('Erro ao atualizar categoria')
      }

      return data

    } catch (error) {
      logger.error('Erro no service de atualização de categoria:', error)
      throw error
    }
  }

  /**
   * Desativar categoria
   */
  async deactivateCategory(categoryId) {
    try {
      const { data, error } = await supabase
        .from('scratch_categories')
        .update({ 
          active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', categoryId)
        .select()
        .single()

      if (error) {
        logger.error('Erro ao desativar categoria:', error)
        throw new Error('Erro ao desativar categoria')
      }

      return data

    } catch (error) {
      logger.error('Erro no service de desativação de categoria:', error)
      throw error
    }
  }

  /**
   * Listar prêmios por categoria
   */
  async getPrizesByCategory(categoryId) {
    try {
      const { data, error } = await supabase
        .from('prizes')
        .select('*')
        .eq('category_id', categoryId)
        .order('value', { ascending: false })

      if (error) {
        logger.error('Erro ao buscar prêmios:', error)
        throw new Error('Erro ao buscar prêmios')
      }

      return data

    } catch (error) {
      logger.error('Erro no service de prêmios por categoria:', error)
      throw error
    }
  }

  /**
   * Criar novo prêmio
   */
  async createPrize(prizeData) {
    try {
      const { data, error } = await supabase
        .from('prizes')
        .insert({
          category_id: prizeData.category_id,
          name: prizeData.name,
          image_url: prizeData.image_url,
          value: prizeData.value,
          probability_weight: prizeData.probability_weight || 1,
          type: prizeData.type || 'cash',
          active: true
        })
        .select()
        .single()

      if (error) {
        logger.error('Erro ao criar prêmio:', error)
        throw new Error('Erro ao criar prêmio')
      }

      return data

    } catch (error) {
      logger.error('Erro no service de criação de prêmio:', error)
      throw error
    }
  }

  /**
   * Atualizar prêmio
   */
  async updatePrize(prizeId, updates) {
    try {
      const allowedFields = ['name', 'image_url', 'value', 'probability_weight', 'type', 'active']
      const filteredUpdates = {}

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          filteredUpdates[key] = value
        }
      }

      filteredUpdates.updated_at = new Date().toISOString()

      const { data, error } = await supabase
        .from('prizes')
        .update(filteredUpdates)
        .eq('id', prizeId)
        .select()
        .single()

      if (error) {
        logger.error('Erro ao atualizar prêmio:', error)
        throw new Error('Erro ao atualizar prêmio')
      }

      return data

    } catch (error) {
      logger.error('Erro no service de atualização de prêmio:', error)
      throw error
    }
  }

  /**
   * Desativar prêmio
   */
  async deactivatePrize(prizeId) {
    try {
      const { data, error } = await supabase
        .from('prizes')
        .update({ 
          active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', prizeId)
        .select()
        .single()

      if (error) {
        logger.error('Erro ao desativar prêmio:', error)
        throw new Error('Erro ao desativar prêmio')
      }

      return data

    } catch (error) {
      logger.error('Erro no service de desativação de prêmio:', error)
      throw error
    }
  }

  /**
   * Listar jogos com paginação
   */
  async getGames(page = 1, limit = 20) {
    try {
      const offset = (page - 1) * limit

      const { data, error, count } = await supabase
        .from('game_sessions')
        .select(`
          *,
          user_profiles!inner(id, full_name),
          scratch_categories!inner(name, slug),
          prizes(name, value)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) {
        logger.error('Erro ao buscar jogos:', error)
        throw new Error('Erro ao buscar jogos')
      }

      return {
        games: data,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }

    } catch (error) {
      logger.error('Erro no service de jogos:', error)
      throw error
    }
  }

  /**
   * Listar transações com paginação
   */
  async getTransactions(page = 1, limit = 20, type = null) {
    try {
      const offset = (page - 1) * limit

      let query = supabase
        .from('transactions')
        .select(`
          *,
          user_profiles!inner(id, full_name)
        `, { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (type) {
        query = query.eq('type', type)
      }

      const { data, error, count } = await query

      if (error) {
        logger.error('Erro ao buscar transações:', error)
        throw new Error('Erro ao buscar transações')
      }

      return {
        transactions: data,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      }

    } catch (error) {
      logger.error('Erro no service de transações:', error)
      throw error
    }
  }

  /**
   * Adicionar saldo a usuário (operação administrativa)
   */
  async addUserBalance(userId, amount, description = 'Crédito administrativo') {
    try {
      // Verificar se o usuário existe
      const { data: user, error: userError } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', userId)
        .single()

      if (userError) {
        logger.error('Erro ao verificar usuário:', userError)
        throw new Error('Usuário não encontrado')
      }

      // Criar transação de depósito administrativo
      const { data, error } = await supabase
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'deposit',
          amount: amount,
          description: description,
          status: 'completed'
        })
        .select()
        .single()

      if (error) {
        logger.error('Erro ao criar transação administrativa:', error)
        throw new Error('Erro ao adicionar saldo')
      }

      logger.info('Saldo adicionado administrativamente', {
        userId,
        amount,
        transactionId: data.id
      })

      return data

    } catch (error) {
      logger.error('Erro no service de adição de saldo:', error)
      throw error
    }
  }
}