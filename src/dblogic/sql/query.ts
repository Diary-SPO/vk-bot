import { client } from '@src/init/connectdb'
/*
export default class Query {
    readonly DB_NAME: string;
    constructor(DB_NAME: string) {
        this.DB_NAME = DB_NAME;
    }
    async findOne<T>(columns: string[], WHERE: string) {
        return (await client.query(`
            SELECT  ${ this.enumeration(columns) }
            from    ${ this.DB_NAME  }
            WHERE   ${      WHERE    }
            LIMIT 1;
        `)).rows[0] as T
    }
    enumeration(values: string[]) {
        return values.join(',');
    }
} */

class TABLE {
  readonly TABLE_NAME: string
  constructor (TABLE_NAME: string) {
    this.TABLE_NAME = TABLE_NAME
  }

  query (type: 'SELECT' | 'UPDATE' | 'DELETE' | 'INSERT'): QUERY {
    return new QUERY(this.TABLE_NAME, type)
  }
}

class QUERY {
  readonly TABLE_NAME: string
  private COLUMNS: string
  private CONDITIONS: WHERE | null = null
  private readonly TYPE: string
  private INSERT: string | null = null
  private UPDATE: string | null = null
  private DELETE: string | null = null
  constructor (TABLE_NAME: string, TYPE: string) {
    this.TABLE_NAME = TABLE_NAME
    this.COLUMNS = '*'
    this.TYPE = TYPE
  }

  // Работаем со столбцами
  columns (columns: string[]): QUERY {
    if (this.COLUMNS !== '*') { this.COLUMNS = [this.COLUMNS, ...columns].join(', ') } else this.COLUMNS = columns.join(', ')
    return this
  }

  column (column: string): QUERY {
    this.COLUMNS = column
    return this
  }

  // Работаем с фильтрами
  where (condition: WHERE): QUERY {
    condition = condition.setQuery(this)
    this.CONDITIONS = condition
    return this
  }

  // Вставка
  insert (values: Insert_values): QUERY {
    const insert = `
        INSERT INTO ${this.TABLE_NAME}
        (${Object.keys(values).join(', ')})
        VALUES ('${Object.values(values).join('\', \'')}\')`
    this.INSERT = insert
    return this
  }

  // Обновление
  update (newValues: Insert_values, where: WHERE): QUERY {
    const update = `
        UPDATE ${this.TABLE_NAME}
        SET ${Object.entries(newValues).map(([key, value]) => `\n${key} = '${value}'`).join(',')}
        WHERE ${where.get()}`
    this.UPDATE = update
    return this
  }

  // Удаление
  delete (where: WHERE): QUERY {
    const sqlDelete = `
        DELETE FROM ${this.TABLE_NAME}
        WHERE ${where.get()}`
    this.DELETE = sqlDelete
    return this
  }

  // Выполнение
  async run (): Promise<any | []> {
    const query = `${this._CONSTRUCT_TYPE()} `
    console.log(query)
    return (await client.query(query)).rows ?? []
  }

  private _CONSTRUCT_TYPE (): string | null | undefined {
    switch (this.TYPE) {
      case 'SELECT':{
        let query = `
                SELECT ${this.COLUMNS} FROM ${this.TABLE_NAME}
                `
        if (this.CONDITIONS != null) {
          if (this.CONDITIONS.get() != null) {
            query += `WHERE ${this.CONDITIONS.get()}`
          }
        }
        return query
      }
      case 'INSERT': {
        return this.INSERT
      }
      case 'UPDATE': {
        return this.UPDATE
      }
      case 'DELETE': {
        return this.DELETE
      }
    }
  }
}

class WHERE {
  private CONDITIONS: string | null = null
  private query: QUERY | null = null
  // constructor () {}
  setQuery (query: QUERY): WHERE {
    this.query = query
    return this
  }

  IF (condition: string): WHERE {
    this.CONDITIONS = condition
    return this
  }

  ANDIF (condition: string | WHERE): WHERE {
    if (typeof (condition) === 'string') { this.CONDITIONS += ` AND ${condition}` } else this.CONDITIONS += `AND  (${condition.get()})`
    return this
  }

  ORIF (condition: string | WHERE): WHERE {
    if (typeof (condition) === 'string') { this.CONDITIONS += ` OR ${condition}` } else this.CONDITIONS += ` OR (${condition.get()})`
    return this
  }

  get (): string | null {
    return this.CONDITIONS
  }
}

export { TABLE, QUERY, WHERE }
export type Insert_values = Record<string, string | number>
