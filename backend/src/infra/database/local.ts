import { AsyncLocalStorage } from 'async_hooks'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '../../env'
import type { DrizzleTransaction } from './drizzle.types'

const pool = new Pool({
  host: env.IS_DOCKER ? env.LOCAL_DB_HOST : 'localhost',
  port: env.LOCAL_DB_PORT,
  database: env.LOCAL_DB_NAME,
  user: env.LOCAL_DB_USER,
  password: env.LOCAL_DB_PASSWORD,
})

const db = drizzle({ client: pool })

const als = new AsyncLocalStorage<DrizzleTransaction>()

type MethodDecorator = (_: unknown, __: unknown, descriptor: PropertyDescriptor) => void

export const Transaction =
  (): MethodDecorator =>
  (_: unknown, __: unknown, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: unknown[]) {
      return db.transaction((tx: DrizzleTransaction) =>
        als.run(tx, () => originalMethod.apply(this, args))
      )
    }
  }

export const getTransaction = (): DrizzleTransaction => {
  const tx = als.getStore()

  if (!tx) {
    throw new Error('No transaction found. Make sure to use @Transaction().')
  }

  return tx
}
