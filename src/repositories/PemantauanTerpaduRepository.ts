import { prisma } from '../config/database'

export class PemantauanTerpaduRepository {
  async create(data: {
    wilayahId: number
    posId: number
    curahHujan?: number
    debitAir?: number
    tinggiMukaAir?: number
    tinggiGenangan?: number
    suhuUdara?: number
    kecepatanAngin?: number
  }) {
    return await prisma.pemantauanTerpadu.create({
      data,
      include: {
        wilayah: true,
        pos: true,
      },
    })
  }

  async findAll() {
    return await prisma.pemantauanTerpadu.findMany({
      include: {
        wilayah: true,
        pos: true,
      },
      orderBy: { updatedAt: 'desc' },
    })
  }

  async findById(id: number) {
    return await prisma.pemantauanTerpadu.findUnique({
      where: { id },
      include: {
        wilayah: true,
        pos: true,
      },
    })
  }

  async update(
    id: number,
    data: {
      wilayahId?: number
      posId?: number
      curahHujan?: number
      debitAir?: number
      tinggiMukaAir?: number
      tinggiGenangan?: number
      suhuUdara?: number
      kecepatanAngin?: number
    }
  ) {
    return await prisma.pemantauanTerpadu.update({
      where: { id },
      data,
      include: {
        wilayah: true,
        pos: true,
      },
    })
  }

  async delete(id: number) {
    return await prisma.pemantauanTerpadu.delete({
      where: { id },
    })
  }
}
