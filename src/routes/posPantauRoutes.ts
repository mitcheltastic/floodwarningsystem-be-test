import { Router } from 'express'
import { PosPantauController } from '../controllers/PosPantauController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()
const controller = new PosPantauController()

router.get('/pos-pantau', controller.getAll)
router.get('/pos-pantau/:id', controller.getById)
router.post('/pos-pantau', authMiddleware, controller.create)
router.put('/pos-pantau/:id', authMiddleware, controller.update)
router.delete('/pos-pantau/:id', authMiddleware, controller.delete)

export default router
