import { env } from '../../env'
import { connection } from './connection'

export type CacheKey = 'listing' | 'test'
type Set = { key: CacheKey; customerID: string; segment: string; value: string; ttl: number }
type Get = { key: CacheKey; customerID: string; segment: string }
type Invalidate = { key: CacheKey; customerID: string }

export class CacheManager {
  static async set({ key, customerID, segment, value, ttl }: Set): Promise<void> {
    await connection.set(`${key}:${customerID}:${segment}`, value, 'EX', ttl)
  }

  static get({ key, customerID, segment }: Get): Promise<string | null> {
    return connection.get(`${key}:${customerID}:${segment}`)
  }

  static async invalidate({ key, customerID }: Invalidate): Promise<void> {
    let cursor = '0'

    do {
      const [next, batch] = await connection.scan(
        cursor,
        'MATCH',
        `${key}:${customerID}:*`,
        'COUNT',
        100
      )

      cursor = next

      if (!batch.length) continue

      await connection.unlink(...batch)
    } while (cursor !== '0')
  }

  static async flush(key: CacheKey): Promise<void> {
    if (env.RUN_ENV !== 'local') return

    const keys = await connection.keys(`${key}:*`)
    if (keys.length) await connection.del(...keys)
  }
}
