import fs from 'fs'
import dotenv from 'dotenv'
import { type ParamsInit } from './types'
import checkEnvVariables from './utils'

dotenv.config()

if (!fs.existsSync('.env')) {
  console.log('Отсутствует .env файл...')
  process.exit()
}

const PARAMS_INIT: ParamsInit = {}

checkEnvVariables(PARAMS_INIT)

export const {
  TOKEN,
  LIMIT,
  SERVER_URL,
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  ENCRYPT_KEY
} = PARAMS_INIT
