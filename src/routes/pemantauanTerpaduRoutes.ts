import { Router } from 'express'
import { PemantauanTerpaduController } from '../controllers/PemantauanTerpaduController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()
const controller = new PemantauanTerpaduController()

router.get('/pemantauan-terpadu', controller.getAll)
router.get('/pemantauan-terpadu/:id', controller.getById)
router.post('/pemantauan-terpadu', authMiddleware, controller.create)
router.put('/pemantauan-terpadu/:id', authMiddleware, controller.update)
router.delete('/pemantauan-terpadu/:id', authMiddleware, controller.delete)

export default router
