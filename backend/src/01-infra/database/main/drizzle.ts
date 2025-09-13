import { AsyncLocalStorage } from 'async_hooks'
import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import type { DrizzleTransaction } from '../../../types'
import { env } from '../../env'

const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
})

const db = drizzle({ client: pool })

const als = new AsyncLocalStorage<DrizzleTransaction>()

type MethodDecorator = (_: unknown, __: unknown, descriptor: PropertyDescriptor) => void

export const Transaction =
  (): MethodDecorator =>
  (_: unknown, __: unknown, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.value

    descriptor.value = function (...args: unknown[]): Promise<unknown> {
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
