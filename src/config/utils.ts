import { type ParamsInit, type ParamsKeys } from './types'

function checkEnvVariables (params: ParamsInit): void {
  for (const key of Object.keys(params) as ParamsKeys[]) {
    const value = process.env[key] ?? Bun.env[key]
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`Environment variable ${key} is not defined or empty.`)
    }

    params[key] = value
  }
}

export default checkEnvVariables
