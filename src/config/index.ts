import fs from 'fs'

if (!fs.existsSync('.env')) {
  console.log('Отсутствует .env файл...')
  process.exit()
}

export const TOKEN = Bun.env?.TOKEN ?? ''
export const LIMIT = Bun.env?.LIMIT ?? 20
