import { Router } from 'express'
import { UserController } from '../controllers/UserController'
import { authMiddleware } from '../middlewares/authMiddleware'
import { requireAgency } from '../middlewares/requireAgency'
import { Agency } from '../types'
import rateLimit from 'express-rate-limit'

const router = Router()
const userController = new UserController()

/**
 * Rate limiter specific to the Pendidikan panel login.
 * Stricter than the global limiter: 20 attempts per 15 minutes.
 */
const pendidikanAuthLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Terlalu banyak percobaan login. Silakan coba lagi dalam 15 menit.',
  },
})

// ─── Public Routes ────────────────────────────────────────────────────────────
// No self-registration endpoint. Accounts are created exclusively by SUPER_ADMIN.
router.post('/auth/login', pendidikanAuthLimiter, userController.login)

// ─── Protected Routes ─────────────────────────────────────────────────────────
// Double-guard: must be authenticated (authMiddleware) AND belong to PENDIDIKAN_KAB agency (requireAgency).
router.get(
  '/profile/:id',
  authMiddleware,
  requireAgency(Agency.PENDIDIKAN_KAB),
  userController.getUserById,
)

router.put(
  '/profile',
  authMiddleware,
  requireAgency(Agency.PENDIDIKAN_KAB),
  userController.updateProfile,
)

router.put(
  '/profile/password',
  authMiddleware,
  requireAgency(Agency.PENDIDIKAN_KAB),
  userController.updatePassword,
)

export default router
