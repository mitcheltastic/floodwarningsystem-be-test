import { PemantauanTerpaduRepository } from '../repositories/PemantauanTerpaduRepository'
import { WilayahPantauanRepository } from '../repositories/WilayahPantauanRepository'
import { PosPantauRepository } from '../repositories/PosPantauRepository'
import { PemantauanTerpaduCreateRequest, PemantauanTerpaduUpdateRequest } from '../types'

export class PemantauanTerpaduService {
  private repository = new PemantauanTerpaduRepository()
  private wilayahRepository = new WilayahPantauanRepository()
  private posRepository = new PosPantauRepository()

  async create(data: PemantauanTerpaduCreateRequest) {
    try {
      if (data.wilayahId === undefined || data.posId === undefined) {
        return { success: false, message: 'wilayahId dan posId wajib diisi' }
      }

      // Pastikan wilayah & pos benar-benar ada di DB
      const wilayahExists = await this.wilayahRepository.findById(data.wilayahId)
      if (!wilayahExists) {
        return { success: false, message: 'Wilayah pantauan tidak ditemukan' }
      }

      const posExists = await this.posRepository.findById(data.posId)
      if (!posExists) {
        return { success: false, message: 'Pos pantau tidak ditemukan' }
      }

      const created = await this.repository.create(data)
      return { success: true, data: created }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }

  async getAll() {
    try {
      const all = await this.repository.findAll()
      return { success: true, data: all }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }

  async getById(id: number) {
    try {
      const found = await this.repository.findById(id)
      if (!found) return { success: false, message: 'Data pemantauan terpadu tidak ditemukan' }
      return { success: true, data: found }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }

  async update(id: number, data: PemantauanTerpaduUpdateRequest) {
    try {
      const existing = await this.repository.findById(id)
      if (!existing) return { success: false, message: 'Data pemantauan terpadu tidak ditemukan' }

      if (data.wilayahId !== undefined) {
        const wilayahExists = await this.wilayahRepository.findById(data.wilayahId)
        if (!wilayahExists) return { success: false, message: 'Wilayah pantauan tidak ditemukan' }
      }

      if (data.posId !== undefined) {
        const posExists = await this.posRepository.findById(data.posId)
        if (!posExists) return { success: false, message: 'Pos pantau tidak ditemukan' }
      }

      const updated = await this.repository.update(id, data)
      return { success: true, data: updated }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }

  async delete(id: number) {
    try {
      const existing = await this.repository.findById(id)
      if (!existing) return { success: false, message: 'Data pemantauan terpadu tidak ditemukan' }
      await this.repository.delete(id)
      return { success: true, message: 'Data pemantauan terpadu berhasil dihapus', data: existing }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }
}
