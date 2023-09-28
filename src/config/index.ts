import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

if (!fs.existsSync('.env')) {
  console.log('Отсутствует .env файл...')
  process.exit()
}

export const TOKEN = Bun.env?.TOKEN                   ?? process.env?.TOKEN        ?? undefined
export const LIMIT = Bun.env?.LIMIT                   ?? process.env?.LIMIT        ?? 20
export const SERVER_URL = Bun.env?.SERVER_URL         ?? process.env?.SERVER_URL   ?? undefined
export const DATABASE_HOST = Bun.env?.DATABASE_HOST   ?? process.env?.DATABASE_HOST?? undefined
export const DATABASE_PORT = Bun.env?.DATABASE_PORT   ?? process.env?.DATABASE_PORT?? undefined
export const DATABASE_NAME = Bun.env?.DATABASE_NAME   ?? process.env?.DATABASE_NAME?? undefined
export const ENCRYPT_KEY = Bun.env?.ENCRYPT_KEY       ?? process.env?.ENCRYPT_KEY  ?? undefined // 12, 24 или 32 символа