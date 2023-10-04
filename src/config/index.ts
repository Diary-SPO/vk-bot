import fs from 'fs'
import dotenv from 'dotenv'

dotenv.config()

if (!fs.existsSync('.env')) {
  console.log('Отсутствует .env файл...')
  process.exit()
}

const PARAMS_INIT: {[key: string]: string | number | undefined} = {
  TOKEN: undefined,
  LIMIT: 20,
  SERVER_URL: undefined,
  DATABASE_HOST: undefined,
  DATABASE_PORT: undefined,
  DATABASE_NAME: undefined,
  DATABASE_USERNAME: undefined,
  DATABASE_PASSWORD: undefined,
  ENCRYPT_KEY: undefined
}

Object.keys(PARAMS_INIT).forEach((index) => {
  PARAMS_INIT[index] = Bun.env?.[index] ?? process.env?.[index] ?? PARAMS_INIT[index]
  if (!PARAMS_INIT[index]) throw new Error(`The value of the field '${index}' is not filled in the .env file! Specify a value other than undefined`)
})

export const { TOKEN, LIMIT, SERVER_URL, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD, ENCRYPT_KEY } = PARAMS_INIT