import { Request, Response } from 'express'
import { PemantauanTerpaduService } from '../services/PemantauanTerpaduService'
import { ActivityLogService } from '../services/ActivityLogService'
import { LogAction } from '@prisma/client'
import { UserPayload } from '../types'

export class PemantauanTerpaduController {
  private service = new PemantauanTerpaduService()
  private logService = new ActivityLogService()

  create = async (req: Request, res: Response) => {
    const requestor = (req as any).user as UserPayload
    const result = await this.service.create(req.body)
    
    if (result.success && result.data) {
      await this.logService.logAction(
        requestor?.id,
        LogAction.CREATE,
        'PemantauanTerpadu',
        `Menambahkan pemantauan terpadu untuk Wilayah: ${result.data.wilayah?.nama || result.data.wilayahId} dan Pos: ${result.data.pos?.nama || result.data.posId}`
      )
      return res.status(201).json(result)
    }
    return res.status(400).json(result)
  }

  getAll = async (req: Request, res: Response) => {
    const result = await this.service.getAll()
    return res.status(result.success ? 200 : 500).json(result)
  }

  getById = async (req: Request, res: Response) => {
    const parsedId = parseInt(req.params.id)
    if (isNaN(parsedId)) return res.status(400).json({ success: false, message: 'Invalid ID format' })

    const result = await this.service.getById(parsedId)
    return res.status(result.success ? 200 : 404).json(result)
  }

  update = async (req: Request, res: Response) => {
    const requestor = (req as any).user as UserPayload
    const parsedId = parseInt(req.params.id)
    if (isNaN(parsedId)) return res.status(400).json({ success: false, message: 'Invalid ID format' })

    const result = await this.service.update(parsedId, req.body)
    if (result.success && result.data) {
      await this.logService.logAction(
        requestor?.id,
        LogAction.UPDATE,
        'PemantauanTerpadu',
        `Memperbarui pemantauan terpadu ID: ${result.data.id} (Wilayah: ${result.data.wilayah?.nama || result.data.wilayahId}, Pos: ${result.data.pos?.nama || result.data.posId})`
      )
      return res.status(200).json(result)
    }
    return res.status(400).json(result)
  }

  delete = async (req: Request, res: Response) => {
    const requestor = (req as any).user as UserPayload
    const parsedId = parseInt(req.params.id)
    if (isNaN(parsedId)) return res.status(400).json({ success: false, message: 'Invalid ID format' })

    const result = await this.service.delete(parsedId)
    if (result.success && result.data) {
      await this.logService.logAction(
        requestor?.id,
        LogAction.DELETE,
        'PemantauanTerpadu',
        `Menghapus pemantauan terpadu ID: ${result.data.id} (Wilayah: ${result.data.wilayah?.nama || result.data.wilayahId}, Pos: ${result.data.pos?.nama || result.data.posId})`
      )
      return res.status(200).json(result)
    }
    return res.status(400).json(result)
  }
}
