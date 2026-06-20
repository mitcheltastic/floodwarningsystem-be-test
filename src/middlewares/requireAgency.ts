/// <reference path="../types/express.d.ts" />
import { Request, Response, NextFunction } from 'express'
import { Agency } from '../types'

/**
 * Middleware factory that enforces agency-level access control.
 *
 * Must be used **after** `authMiddleware` (which populates `req.user`).
 * Returns a 403 if the authenticated user's agency does not match
 * the required agency for this route.
 *
 * @example
 * router.get('/profile', authMiddleware, requireAgency(Agency.PENDIDIKAN_KAB), controller.fn)
 *
 * @param allowedAgency - The Agency enum value that is permitted to access the route.
 */
export const requireAgency = (allowedAgency: Agency) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user

    if (!user || user.agency !== allowedAgency) {
      return res.status(403).json({
        success: false,
        message: `Akses ditolak. Rute ini hanya untuk instansi ${allowedAgency}.`,
      })
    }

    next()
  }
}
