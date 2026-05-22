import { prisma } from '../config/database'

export class PredictionResultRepository {
  async create(data: {
    inputReceived: any
    classProbability: any
    description: string
    floodClass: number
    floodLevel: string
    riskLevel: string
    tmaValue: number
  }) {
    return await prisma.predictionResult.create({ data })
  }

  async findAll() {
    return await prisma.predictionResult.findMany({ orderBy: { createdAt: 'desc' } })
  }

  async findById(id: number) {
    return await prisma.predictionResult.findUnique({ where: { id } })
  }

  async update(
    id: number,
    data: {
      inputReceived?: any
      classProbability?: any
      description?: string
      floodClass?: number
      floodLevel?: string
      riskLevel?: string
      tmaValue?: number
    }
  ) {
    return await prisma.predictionResult.update({ where: { id }, data })
  }

  async delete(id: number) {
    return await prisma.predictionResult.delete({ where: { id } })
  }
}
