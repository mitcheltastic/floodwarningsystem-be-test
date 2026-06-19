import 'dotenv/config'
import { defineConfig } from '@prisma/config'

export default defineConfig({
  earlyAccess: true,
  datasource: {
    url: process.env.DATABASE_URL
  },
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"
  }
})
