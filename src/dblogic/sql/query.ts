import crypto from '@src/dblogic/crypto'
import { client } from '@src/init/connectdb.ts'

async function executeQuery<T> (query: string): Promise<T[]> {
  const result = await client.query(query)
  return result.rows
}

export const decryptData = (data: string | null): string => {
  return crypto.decrypt(data ?? '')
}

interface QueryBuilder<T> {
  table: string
  columns: string[]
  conditions: string

  from: (table: string) => QueryBuilder<T>

  select: (...columns: string[]) => QueryBuilder<T>

  where: (conditions: string) => QueryBuilder<T>

  first: () => Promise<T | null>

  delete: () => Promise<void>

  insert: (data: Partial<T>) => Promise<void>

  update: (data: Partial<T>) => Promise<void>

  buildInsertQuery: (data: Partial<T>) => Promise<string>

  buildUpdateQuery: (data: Partial<T>) => Promise<string>
}

export function createQueryBuilder<T> (): QueryBuilder<T> {
  return {
    table: '',
    columns: ['*'],
    conditions: '',

    from (table) {
      this.table = table
      return this
    },

    select (...columns) {
      this.columns = columns
      return this
    },

    where (conditions) {
      this.conditions = conditions
      return this
    },

    async first (): Promise<T | null> {
      const query = `SELECT ${this.columns.join(', ')} FROM ${this.table} WHERE ${this.conditions} LIMIT 1`
      const result = await executeQuery<T>(query)
      return result[0] || null
    },

    async delete (): Promise<void> {
      const query = `DELETE FROM ${this.table} WHERE ${this.conditions}`
      await executeQuery(query)
    },

    async buildInsertQuery (data: Partial<T>): Promise<string> {
      const columns = Object.keys(data).join(', ')
      const values = Object.values(data).map((value) => typeof value === 'string' ? `'${value}'` : value).join(', ')
      return `INSERT INTO ${this.table} (${columns}) VALUES (${values})`
    },

    async insert (data: Partial<T>): Promise<void> {
      const columns = Object.keys(data).join(', ')
      const values = Object.values(data).map((value) => typeof value === 'string' ? `'${value}'` : value).join(', ')
      const query = `INSERT INTO ${this.table} (${columns}) VALUES (${values})`
      await executeQuery(query)
    },

    async buildUpdateQuery (data: Partial<T>): Promise<string> {
      const updateValues = Object.entries(data)
        .map(([column, value]) => {
          if (typeof value === 'string') {
            return `${column} = '${value}'`
          }
          // TODO: разобраться в eslint ошибке ( Fix :) )
          // UPD: Он жаловался на неопределённый тип ( map(value: [string, -> unknown <- ]) )
          return `${String(column)} = ${String(value)}`
        })
        .join(', ')

      return `UPDATE ${this.table} SET ${updateValues} WHERE ${this.conditions}`
    },

    async update (data: Partial<T>): Promise<void> {
      await executeQuery(await this.buildUpdateQuery(data))
    }
  }
}
