import { AdminService } from '../services/admin.service.js'
import logger from '../utils/logger.js'

const adminService = new AdminService()

/**
 * Controller para operações administrativas
 */
export class AdminController {

  /**
   * Obter estatísticas gerais da plataforma
   */
  async getGeneralStats(req, res) {
    try {
      const stats = await adminService.getGeneralStats()

      res.json({
        success: true,
        data: stats
      })
    } catch (error) {
      logger.error('Erro no controller de estatísticas gerais:', error)
      
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar estatísticas'
      })
    }
  }

  /**
   * Listar usuários
   */
  async getUsers(req, res) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 20

      const result = await adminService.getUsers(page, limit)

      res.json({
        success: true,
        data: {
          users: result.users.map(user => ({
            id: user.id,
            full_name: user.full_name,
            wallet_balance: parseFloat(user.wallet_balance),
            total_spent: parseFloat(user.total_spent),
            total_won: parseFloat(user.total_won),
            created_at: user.created_at,
            last_login: user.last_sign_in_at || null
          })),
          pagination: result.pagination
        }
      })
    } catch (error) {
      logger.error('Erro no controller de usuários:', error)
      
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar usuários'
      })
    }
  }

  /**
   * Listar categorias
   */
  async getCategories(req, res) {
    try {
      const categories = await adminService.getCategories()

      res.json({
        success: true,
        data: categories.map(category => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
          price: parseFloat(category.price),
          max_reward: parseFloat(category.max_reward),
          rtp_percentage: category.rtp_percentage,
          active: category.active,
          banner_url: category.banner_url,
          created_at: category.created_at,
          total_games: category.total_games || 0
        }))
      })
    } catch (error) {
      logger.error('Erro no controller de categorias:', error)
      
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar categorias'
      })
    }
  }

  /**
   * Criar nova categoria
   */
  async createCategory(req, res) {
    try {
      const categoryData = req.body

      const category = await adminService.createCategory(categoryData)

      res.status(201).json({
        success: true,
        message: 'Categoria criada com sucesso',
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          price: parseFloat(category.price),
          max_reward: parseFloat(category.max_reward),
          rtp_percentage: category.rtp_percentage,
          active: category.active,
          banner_url: category.banner_url,
          created_at: category.created_at
        }
      })
    } catch (error) {
      logger.error('Erro no controller de criação de categoria:', error)
      
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar categoria'
      })
    }
  }

  /**
   * Atualizar categoria
   */
  async updateCategory(req, res) {
    try {
      const { id } = req.params
      const updates = req.body

      const category = await adminService.updateCategory(id, updates)

      res.json({
        success: true,
        message: 'Categoria atualizada com sucesso',
        data: {
          id: category.id,
          name: category.name,
          slug: category.slug,
          price: parseFloat(category.price),
          max_reward: parseFloat(category.max_reward),
          rtp_percentage: category.rtp_percentage,
          active: category.active,
          banner_url: category.banner_url,
          updated_at: category.updated_at
        }
      })
    } catch (error) {
      logger.error('Erro no controller de atualização de categoria:', error)
      
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar categoria'
      })
    }
  }

  /**
   * Desativar categoria
   */
  async deactivateCategory(req, res) {
    try {
      const { id } = req.params

      await adminService.deactivateCategory(id)

      res.json({
        success: true,
        message: 'Categoria desativada com sucesso'
      })
    } catch (error) {
      logger.error('Erro no controller de desativação de categoria:', error)
      
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao desativar categoria'
      })
    }
  }

  /**
   * Listar prêmios de uma categoria
   */
  async getPrizesByCategory(req, res) {
    try {
      const { categoryId } = req.params

      const prizes = await adminService.getPrizesByCategory(categoryId)

      res.json({
        success: true,
        data: prizes.map(prize => ({
          id: prize.id,
          category_id: prize.category_id,
          name: prize.name,
          image_url: prize.image_url,
          value: parseFloat(prize.value),
          probability_weight: prize.probability_weight,
          type: prize.type,
          active: prize.active,
          created_at: prize.created_at
        }))
      })
    } catch (error) {
      logger.error('Erro no controller de prêmios por categoria:', error)
      
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao buscar prêmios'
      })
    }
  }

  /**
   * Criar novo prêmio
   */
  async createPrize(req, res) {
    try {
      const prizeData = req.body

      const prize = await adminService.createPrize(prizeData)

      res.status(201).json({
        success: true,
        message: 'Prêmio criado com sucesso',
        data: {
          id: prize.id,
          category_id: prize.category_id,
          name: prize.name,
          image_url: prize.image_url,
          value: parseFloat(prize.value),
          probability_weight: prize.probability_weight,
          type: prize.type,
          active: prize.active,
          created_at: prize.created_at
        }
      })
    } catch (error) {
      logger.error('Erro no controller de criação de prêmio:', error)
      
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao criar prêmio'
      })
    }
  }

  /**
   * Atualizar prêmio
   */
  async updatePrize(req, res) {
    try {
      const { id } = req.params
      const updates = req.body

      const prize = await adminService.updatePrize(id, updates)

      res.json({
        success: true,
        message: 'Prêmio atualizado com sucesso',
        data: {
          id: prize.id,
          category_id: prize.category_id,
          name: prize.name,
          image_url: prize.image_url,
          value: parseFloat(prize.value),
          probability_weight: prize.probability_weight,
          type: prize.type,
          active: prize.active,
          updated_at: prize.updated_at
        }
      })
    } catch (error) {
      logger.error('Erro no controller de atualização de prêmio:', error)
      
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao atualizar prêmio'
      })
    }
  }

  /**
   * Desativar prêmio
   */
  async deactivatePrize(req, res) {
    try {
      const { id } = req.params

      await adminService.deactivatePrize(id)

      res.json({
        success: true,
        message: 'Prêmio desativado com sucesso'
      })
    } catch (error) {
      logger.error('Erro no controller de desativação de prêmio:', error)
      
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao desativar prêmio'
      })
    }
  }

  /**
   * Listar jogos
   */
  async getGames(req, res) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 20

      const result = await adminService.getGames(page, limit)

      res.json({
        success: true,
        data: {
          games: result.games.map(game => ({
            id: game.id,
            user: {
              id: game.user_profiles?.id,
              full_name: game.user_profiles?.full_name
            },
            category: {
              name: game.scratch_categories?.name,
              slug: game.scratch_categories?.slug
            },
            prize: game.prizes ? {
              name: game.prizes.name,
              value: parseFloat(game.prizes.value)
            } : null,
            amount_spent: parseFloat(game.amount_spent),
            amount_won: parseFloat(game.amount_won),
            created_at: game.created_at,
            completed_at: game.completed_at
          })),
          pagination: result.pagination
        }
      })
    } catch (error) {
      logger.error('Erro no controller de jogos:', error)
      
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar jogos'
      })
    }
  }

  /**
   * Listar transações
   */
  async getTransactions(req, res) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 20
      const type = req.query.type || null

      const result = await adminService.getTransactions(page, limit, type)

      res.json({
        success: true,
        data: {
          transactions: result.transactions.map(transaction => ({
            id: transaction.id,
            user: {
              id: transaction.user_profiles?.id,
              full_name: transaction.user_profiles?.full_name
            },
            type: transaction.type,
            amount: parseFloat(transaction.amount),
            description: transaction.description,
            status: transaction.status,
            created_at: transaction.created_at
          })),
          pagination: result.pagination
        }
      })
    } catch (error) {
      logger.error('Erro no controller de transações:', error)
      
      res.status(500).json({
        success: false,
        message: error.message || 'Erro ao buscar transações'
      })
    }
  }

  /**
   * Adicionar saldo a usuário
   */
  async addUserBalance(req, res) {
    try {
      const { userId } = req.params
      const { amount, description } = req.body

      const transaction = await adminService.addUserBalance(userId, amount, description)

      res.status(201).json({
        success: true,
        message: 'Saldo adicionado com sucesso',
        data: {
          transaction_id: transaction.id,
          amount: parseFloat(transaction.amount),
          description: transaction.description,
          created_at: transaction.created_at
        }
      })
    } catch (error) {
      logger.error('Erro no controller de adição de saldo:', error)
      
      res.status(400).json({
        success: false,
        message: error.message || 'Erro ao adicionar saldo'
      })
    }
  }
}