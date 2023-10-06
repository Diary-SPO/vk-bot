import fs from 'fs'
import { type ParamsInit } from './types'
import checkEnvVariables from './utils'

if (!fs.existsSync('.env')) {
  throw new Error('.env file not found.')
}

const PARAMS_INIT: ParamsInit = {
  TOKEN: undefined,
  LIMIT: '20',
  SERVER_URL: undefined,
  DATABASE_HOST: undefined,
  DATABASE_PORT: undefined,
  DATABASE_NAME: undefined,
  DATABASE_USERNAME: undefined,
  DATABASE_PASSWORD: undefined,
  ENCRYPT_KEY: undefined // 32 символа
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
