import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '../../env'
import type { DrizzleTransaction } from './drizzle.types'

const pool = new Pool({
  host: env.IS_DOCKER ? env.TEST_DB_HOST : 'localhost',
  port: env.TEST_DB_PORT,
  database: env.TEST_DB_NAME,
  user: env.TEST_DB_USER,
  password: env.TEST_DB_PASSWORD,
})

const db = drizzle({ client: pool })

const ROLLBACK = Symbol('CUSTOM_DRIZZLE_TRANSACTION_ROLLBACK')

type Callback = (tx: DrizzleTransaction) => Promise<void>

export const rollbackTXWrapper = async (fn: Callback): Promise<void> => {
  return db
    .transaction(async (tx) => {
      await fn(tx)
      throw ROLLBACK
    })
    .catch((e) => {
      if (e === ROLLBACK) return
      throw e
    })
}
