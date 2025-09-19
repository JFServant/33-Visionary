import { env } from '../../env'
import { connection } from './connection'

export type CacheKey = 'listing' | 'test'
type Set = { key: CacheKey; customerID: string; value: string; ttl: number }
type Get = { key: CacheKey; customerID: string }
type Del = { key: CacheKey; customerID: string }

export class CacheManager {
  static async set({ key, customerID, value, ttl }: Set): Promise<void> {
    await connection.set(`${key}:${customerID}`, value, 'EX', ttl)
  }

  static get({ key, customerID }: Get): Promise<string | null> {
    return connection.get(`${key}:${customerID}`)
  }

  static async del({ key, customerID }: Del): Promise<void> {
    await connection.del(`${key}:${customerID}`)
  }

  static async flush(key: CacheKey): Promise<void> {
    if (env.RUN_ENV !== 'local') return

    const keys = await connection.keys(`${key}:*`)
    if (keys.length) await connection.del(...keys)
  }
}
