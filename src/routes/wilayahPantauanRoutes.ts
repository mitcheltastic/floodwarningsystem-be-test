import { Router } from 'express'
import { WilayahPantauanController } from '../controllers/WilayahPantauanController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()
const controller = new WilayahPantauanController()

router.get('/wilayah-pantauan', controller.getAll)
router.get('/wilayah-pantauan/:id', controller.getById)
router.post('/wilayah-pantauan', authMiddleware, controller.create)
router.put('/wilayah-pantauan/:id', authMiddleware, controller.update)
router.delete('/wilayah-pantauan/:id', authMiddleware, controller.delete)

export default router
