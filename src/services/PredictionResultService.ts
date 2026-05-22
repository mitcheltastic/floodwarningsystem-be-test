import { PredictionResultRepository } from '../repositories/PredictionResultRepository'
import { PredictionResultCreateRequest, PredictionResultUpdateRequest } from '../types'

export class PredictionResultService {
  private repository = new PredictionResultRepository()

  async create(data: PredictionResultCreateRequest) {
    try {
      if (data.description === undefined || data.floodClass === undefined || data.floodLevel === undefined || data.riskLevel === undefined || data.tmaValue === undefined) {
        return { success: false, message: 'Field description, floodClass, floodLevel, riskLevel, tmaValue wajib diisi' }
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
      if (!found) return { success: false, message: 'Data hasil prediksi tidak ditemukan' }
      return { success: true, data: found }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }

  async update(id: number, data: PredictionResultUpdateRequest) {
    try {
      const existing = await this.repository.findById(id)
      if (!existing) return { success: false, message: 'Data hasil prediksi tidak ditemukan' }
      const updated = await this.repository.update(id, data)
      return { success: true, data: updated }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }

  async delete(id: number) {
    try {
      const existing = await this.repository.findById(id)
      if (!existing) return { success: false, message: 'Data hasil prediksi tidak ditemukan' }
      await this.repository.delete(id)
      return { success: true, message: 'Data hasil prediksi berhasil dihapus', data: existing }
    } catch (error) {
      return { success: false, message: (error as Error).message }
    }
  }
}
