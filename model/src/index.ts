import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { detectionRouter } from './02-detection/router.js'
import { CocoSSD } from './99-models/cocossd.js'

const app = new Hono()

app.get('/health', ({ json: response }) => {
  return response({ status: 'ok' }, 200)
})

app.route('/detection', detectionRouter)

const init = async (): Promise<void> => {
  await CocoSSD.init()
}

init()

serve({
  fetch: app.fetch,
  port: 49543,
})
