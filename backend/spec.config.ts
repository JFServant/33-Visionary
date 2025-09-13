import { beforeAll } from 'bun:test'
import { S3Manager } from './src/01-infra/s3/manager'

beforeAll(async () => {
  await S3Manager.init()
})
