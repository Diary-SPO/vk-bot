import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

if (!fs.existsSync('.env')) {
  console.log('Отсутствует .env файл...')
  process.exit()
}

export const TOKEN = Bun.env?.TOKEN ?? process.env?.TOKEN ?? ''
export const LIMIT = Bun.env?.LIMIT ?? process.env?.LIMIT ?? 20
export const SERVER_URL = Bun.env?.SERVER_URL ?? process.env?.SERVER_URL ?? undefined
export const DATABASE_HOST = Bun.env?.DATABASE_HOST ?? process.env?.DATABASE_HOST ?? undefined
export const DATABASE_PORT = Bun.env?.DATABASE_PORT ?? process.env?.DATABASE_PORT ?? undefined
export const DATABASE_NAME = Bun.env?.DATABASE_NAME ?? process.env?.DATABASE_NAME ?? undefined
export const DATABASE_USERNAME = Bun.env?.DATABASE_USERNAME ?? process.env?.DATABASE_USERNAME ?? undefined
export const DATABASE_PASSWORD = Bun.env?.DATABASE_PASSWORD ?? process.env?.DATABASE_PASSWORD ?? undefined
export const ENCRYPT_KEY = Bun.env?.ENCRYPT_KEY ?? process.env?.ENCRYPT_KEY ?? '' // 12, 24 или 32 символа
