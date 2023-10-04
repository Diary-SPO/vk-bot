export interface ParamsInit {
  TOKEN?: string
  LIMIT?: string
  SERVER_URL?: string
  DATABASE_HOST?: string
  DATABASE_PORT?: string
  DATABASE_NAME?: string
  DATABASE_USERNAME?: string
  DATABASE_PASSWORD?: string
  ENCRYPT_KEY?: string
}

export type ParamsKeys = keyof ParamsInit
