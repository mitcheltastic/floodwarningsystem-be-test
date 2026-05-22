import { Router } from 'express'
import { PredictionResultController } from '../controllers/PredictionResultController'
import { authMiddleware } from '../middlewares/authMiddleware'

const router = Router()
const controller = new PredictionResultController()

router.get('/prediction-result', controller.getAll)
router.get('/prediction-result/:id', controller.getById)
router.post('/prediction-result', authMiddleware, controller.create)
router.put('/prediction-result/:id', authMiddleware, controller.update)
router.delete('/prediction-result/:id', authMiddleware, controller.delete)

export default router
