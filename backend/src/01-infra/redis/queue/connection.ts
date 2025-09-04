import IORedis from 'ioredis'
import { env } from '../../../00-global/env'

export const connection = new IORedis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
  maxRetriesPerRequest: null,
})
