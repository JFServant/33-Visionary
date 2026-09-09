import type { ServeOptions } from 'bun'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from './01-infra/env'
import { DetectionAssigner } from './01-infra/redis/queue/jobs/detection'
import { S3Manager } from './01-infra/s3/manager'
import { sseConnection } from './01-infra/sse/connection'
import { SSEManager } from './01-infra/sse/manager'
import { identityRouter } from './02-identity/router'
import { DetectionWorker } from './03-image/detection/worker'
import { imageRouter } from './03-image/router'

const app = new Hono()

app.use(cors({ origin: env.CLIENT_URL }))

app.get('/health', (c): Response => c.json({ ok: true }))

app.get('/event/:customerID', sseConnection)

app.route('/identity', identityRouter)
app.route('/image', imageRouter)

DetectionAssigner(DetectionWorker.run)

const init = async (): Promise<void> => {
  await S3Manager.init()
  SSEManager.heartbeat()
}

init()

// ts-prune-ignore-next
export default {
  port: 49321,
  idleTimeout: 0,
  fetch: app.fetch,
} satisfies ServeOptions
