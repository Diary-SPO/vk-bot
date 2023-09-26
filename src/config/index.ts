import fs from 'fs'

if (!fs.existsSync('.env')) {
  console.log('Отсутствует .env файл...')
  process.exit()
}

export const TOKEN = Bun.env?.TOKEN ?? undefined
export const LIMIT = Bun.env?.LIMIT ?? 20
export const SERVER_URL = Bun.env?.SERVER_URL ?? undefined
