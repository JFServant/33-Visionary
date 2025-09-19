import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import type { DrizzleTransaction } from '../../../types'
import * as schema from '../schema'

const pool = new Pool({
  host: 'localhost',
  port: 49323,
  database: 'test_db',
  user: 'test_user',
  password: 'test_pass',
})

const client = drizzle({ client: pool, schema })

const ROLLBACK = Symbol('CUSTOM_DRIZZLE_TRANSACTION_ROLLBACK')

type Callback = (tx: DrizzleTransaction) => Promise<void>

export const rollbackTXWrapper = async (fn: Callback): Promise<void> => {
  return client
    .transaction(async (tx) => {
      await fn(tx)
      throw ROLLBACK
    })
    .catch((e) => {
      if (e === ROLLBACK) return
      throw e
    })
}
