import { PosPantauRepository } from '../repositories/PosPantauRepository'
import { PosPantauCreateRequest, PosPantauUpdateRequest } from '../types'

export class PosPantauService {
  private repository = new PosPantauRepository()

  async create(data: PosPantauCreateRequest) {
    try {
      if (!data.nama) {
        return { success: false, message: 'Nama pos pantau wajib diisi' }
      }
      if (data.latitude === undefined || data.longitude === undefined) {
        return { success: false, message: 'Latitude dan longitude wajib diisi' }
      }
      const pos = await this.repository.create(data)
      return { success: true, data: pos }
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
      const pos = await this.repository.findById(id)
      if (!pos) return { success: false, message: 'Pos pantau tidak ditemukan' }
      return { success: true, data: pos }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }

  async update(id: number, data: PosPantauUpdateRequest) {
    try {
      const existing = await this.repository.findById(id)
      if (!existing) return { success: false, message: 'Pos pantau tidak ditemukan' }
      const updated = await this.repository.update(id, data)
      return { success: true, data: updated }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }

  async delete(id: number) {
    try {
      const existing = await this.repository.findById(id)
      if (!existing) return { success: false, message: 'Pos pantau tidak ditemukan' }
      await this.repository.delete(id)
      return { success: true, message: 'Pos pantau berhasil dihapus', data: existing }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }
}
