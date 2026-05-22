import { PemantauanTerpaduRepository } from '../repositories/PemantauanTerpaduRepository'
import { WilayahPantauanRepository } from '../repositories/WilayahPantauanRepository'
import { PosPantauRepository } from '../repositories/PosPantauRepository'
import { PemantauanTerpaduCreateRequest, PemantauanTerpaduUpdateRequest } from '../types'
import { BbwsService } from '../services/BbwsService'
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

      // 1. Save to Database first
      const created = await this.repository.create(data)

      // 2. Forward measurements to external AI prediction service
      // We only send it if the required metrics are provided in the payload
      if (data.curahHujan !== undefined && data.debitAir !== undefined && data.tinggiMukaAir !== undefined) {
        const aiPayload = {
          curah_hujan: data.curahHujan,
          debit_air: data.debitAir,
          tinggi_muka_air: data.tinggiMukaAir
        }

        // Firing the request asynchronously. The .catch() ensures that if your AI agents 
        // are dead or the server sleeps, it won't break the local database insertion.
        fetch('https://sicitra-banjir-ai.onrender.com/api/predict', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(aiPayload),
        }).catch((e) => {
          console.error('Failed to trigger AI prediction:', e.message)
        })
      }

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
