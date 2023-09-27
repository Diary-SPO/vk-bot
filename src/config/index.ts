import fs from 'fs'

if (!fs.existsSync('.env')) {
  console.log('Отсутствует .env файл...')
  process.exit()
}

export const TOKEN = Bun.env?.TOKEN ?? undefined
export const LIMIT = Bun.env?.LIMIT ?? 20
export const SERVER_URL = Bun.env?.SERVER_URL ?? undefined
export const ENCRYPT_KEY = Bun.env?.ENCRYPT_KEY ?? 'ENCRYPT_KEY!!!!!' // 12, 24 или 32 символа