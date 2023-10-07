import fs from 'fs'
import { type ParamsInit } from './types'
import checkEnvVariables from './utils'

if (!fs.existsSync('.env')) {
  throw new Error('.env file not found.')
}

const PARAMS_INIT: ParamsInit = {
  TOKEN: '',
  LIMIT: '20',
  SERVER_URL: '',
  DATABASE_HOST: '',
  DATABASE_PORT: '',
  DATABASE_NAME: '',
  DATABASE_USERNAME: '',
  DATABASE_PASSWORD: '',
  ENCRYPT_KEY: '' // 32 символа
}

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
