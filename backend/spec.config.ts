import { afterEach, beforeAll, mock } from 'bun:test'
import { CacheManager } from './src/01-infra/redis/cache/manager'
import { S3Manager } from './src/01-infra/s3/manager'

beforeAll(async () => {
  await S3Manager.init()
})

afterEach(async () => {
  mock.clearAllMocks()
  await CacheManager.flush('test')
  await S3Manager.flush('test')
})
