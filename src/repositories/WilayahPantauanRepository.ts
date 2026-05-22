import { prisma } from '../config/database'

export class WilayahPantauanRepository {
  async create(data: { nama: string; latitude: number; longitude: number }) {
    return await prisma.wilayahPantauan.create({ data })
  }

  async findAll() {
    return await prisma.wilayahPantauan.findMany({ orderBy: { updatedAt: 'desc' } })
  }

  async findById(id: number) {
    return await prisma.wilayahPantauan.findUnique({ where: { id } })
  }

  async update(id: number, data: { nama?: string; latitude?: number; longitude?: number }) {
    return await prisma.wilayahPantauan.update({ where: { id }, data })
  }

  async delete(id: number) {
    return await prisma.wilayahPantauan.delete({ where: { id } })
  }
}
