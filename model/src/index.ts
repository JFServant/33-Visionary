import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from './01-infra/env.js'
import { detectionRouter } from './02-detection/router.js'
import { CocoSSD } from './99-models/cocossd.js'

const app = new Hono()

app.use(cors({ origin: env.API_URL }))

app.get('/health', ({ json: response }) => {
  return response({ status: 'ok' }, 200)
})

app.route('/detection', detectionRouter)

// Initialize Models
;(async (): Promise<void> => {
  await CocoSSD.init()
})()

serve({
  fetch: app.fetch,
  port: 49543,
})
