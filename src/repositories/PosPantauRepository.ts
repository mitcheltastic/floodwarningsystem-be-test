import { prisma } from '../config/database'

export class PosPantauRepository {
  async create(data: { nama: string; latitude: number; longitude: number }) {
    return await prisma.posPantau.create({ data })
  }

  async findAll() {
    return await prisma.posPantau.findMany({ orderBy: { updatedAt: 'desc' } })
  }

  async findById(id: number) {
    return await prisma.posPantau.findUnique({ where: { id } })
  }

  async update(id: number, data: { nama?: string; latitude?: number; longitude?: number }) {
    return await prisma.posPantau.update({ where: { id }, data })
  }

  async delete(id: number) {
    return await prisma.posPantau.delete({ where: { id } })
  }
}
