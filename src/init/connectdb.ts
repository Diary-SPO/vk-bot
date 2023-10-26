import { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USERNAME, DATABASE_PASSWORD } from '@config'
import { Client } from 'pg'

const client = new Client({
  host: DATABASE_HOST,
  port: Number(DATABASE_PORT),
  database: DATABASE_NAME,
  user: DATABASE_USERNAME,
  password: DATABASE_PASSWORD
})

await client.connect()
export { client }
