import dotenv from 'dotenv'

const result = dotenv.config()

if (result === null || result === undefined || result.error !== undefined) {
  throw result?.error ?? new Error('Error parsing .env file')
}

export const TOKEN = result.parsed?.TOKEN ?? ''
