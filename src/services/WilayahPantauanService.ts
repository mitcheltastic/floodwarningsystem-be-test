import { WilayahPantauanRepository } from '../repositories/WilayahPantauanRepository'
import { WilayahPantauanCreateRequest, WilayahPantauanUpdateRequest } from '../types'

export class WilayahPantauanService {
  private repository = new WilayahPantauanRepository()

  async create(data: WilayahPantauanCreateRequest) {
    try {
      if (!data.nama) {
        return { success: false, message: 'Nama wilayah wajib diisi' }
      }
      if (data.latitude === undefined || data.longitude === undefined) {
        return { success: false, message: 'Latitude dan longitude wajib diisi' }
      }
      const wilayah = await this.repository.create(data)
      return { success: true, data: wilayah }
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
      const wilayah = await this.repository.findById(id)
      if (!wilayah) return { success: false, message: 'Wilayah pantauan tidak ditemukan' }
      return { success: true, data: wilayah }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }

  async update(id: number, data: WilayahPantauanUpdateRequest) {
    try {
      const existing = await this.repository.findById(id)
      if (!existing) return { success: false, message: 'Wilayah pantauan tidak ditemukan' }
      const updated = await this.repository.update(id, data)
      return { success: true, data: updated }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }

  async delete(id: number) {
    try {
      const existing = await this.repository.findById(id)
      if (!existing) return { success: false, message: 'Wilayah pantauan tidak ditemukan' }
      await this.repository.delete(id)
      return { success: true, message: 'Wilayah pantauan berhasil dihapus', data: existing }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }
}
