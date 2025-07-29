import { Router } from 'express'
import { AdminController } from '../controllers/admin.controller.js'
import { verifyToken } from '../middleware/auth.middleware.js'
import { body } from 'express-validator'
import { handleValidationErrors } from '../middleware/validation.middleware.js'

const router = Router()
const adminController = new AdminController()

/**
 * Todas as rotas requerem autenticação
 * TODO: Implementar middleware de autorização de admin
 */
router.use(verifyToken)

// GET /admin/stats - Estatísticas gerais
router.get('/stats', 
  adminController.getGeneralStats.bind(adminController)
)

// GET /admin/users - Listar usuários
router.get('/users', 
  adminController.getUsers.bind(adminController)
)

// GET /admin/categories - Listar categorias
router.get('/categories', 
  adminController.getCategories.bind(adminController)
)

// POST /admin/categories - Criar categoria
router.post('/categories', 
  [
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('slug').notEmpty().withMessage('Slug é obrigatório'),
    body('price').isFloat({ min: 0.01 }).withMessage('Preço deve ser maior que 0'),
    body('max_reward').isFloat({ min: 0.01 }).withMessage('Recompensa máxima deve ser maior que 0'),
    body('rtp_percentage').isInt({ min: 50, max: 95 }).withMessage('RTP deve estar entre 50% e 95%'),
    handleValidationErrors
  ],
  adminController.createCategory.bind(adminController)
)

// PUT /admin/categories/:id - Atualizar categoria
router.put('/categories/:id', 
  [
    body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
    body('price').optional().isFloat({ min: 0.01 }).withMessage('Preço deve ser maior que 0'),
    body('max_reward').optional().isFloat({ min: 0.01 }).withMessage('Recompensa máxima deve ser maior que 0'),
    body('rtp_percentage').optional().isInt({ min: 50, max: 95 }).withMessage('RTP deve estar entre 50% e 95%'),
    handleValidationErrors
  ],
  adminController.updateCategory.bind(adminController)
)

// DELETE /admin/categories/:id - Desativar categoria
router.delete('/categories/:id', 
  adminController.deactivateCategory.bind(adminController)
)

// GET /admin/prizes/:categoryId - Listar prêmios de uma categoria
router.get('/prizes/:categoryId', 
  adminController.getPrizesByCategory.bind(adminController)
)

// POST /admin/prizes - Criar prêmio
router.post('/prizes', 
  [
    body('category_id').isUUID().withMessage('ID da categoria inválido'),
    body('name').notEmpty().withMessage('Nome é obrigatório'),
    body('image_url').isURL().withMessage('URL da imagem inválida'),
    body('value').isFloat({ min: 0 }).withMessage('Valor deve ser maior ou igual a 0'),
    body('probability_weight').isInt({ min: 1 }).withMessage('Peso da probabilidade deve ser maior que 0'),
    body('type').isIn(['cash', 'product']).withMessage('Tipo deve ser cash ou product'),
    handleValidationErrors
  ],
  adminController.createPrize.bind(adminController)
)

// PUT /admin/prizes/:id - Atualizar prêmio
router.put('/prizes/:id', 
  [
    body('name').optional().notEmpty().withMessage('Nome não pode estar vazio'),
    body('image_url').optional().isURL().withMessage('URL da imagem inválida'),
    body('value').optional().isFloat({ min: 0 }).withMessage('Valor deve ser maior ou igual a 0'),
    body('probability_weight').optional().isInt({ min: 1 }).withMessage('Peso da probabilidade deve ser maior que 0'),
    body('type').optional().isIn(['cash', 'product']).withMessage('Tipo deve ser cash ou product'),
    handleValidationErrors
  ],
  adminController.updatePrize.bind(adminController)
)

// DELETE /admin/prizes/:id - Desativar prêmio
router.delete('/prizes/:id', 
  adminController.deactivatePrize.bind(adminController)
)

// GET /admin/games - Histórico de jogos
router.get('/games', 
  adminController.getGames.bind(adminController)
)

// GET /admin/transactions - Histórico de transações
router.get('/transactions', 
  adminController.getTransactions.bind(adminController)
)

// POST /admin/user/:userId/balance - Adicionar saldo a usuário
router.post('/user/:userId/balance', 
  [
    body('amount').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que 0'),
    body('description').optional().isString().withMessage('Descrição deve ser texto'),
    handleValidationErrors
  ],
  adminController.addUserBalance.bind(adminController)
)

export default router