import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { detectionRouter } from './02-detection/router.js'
import { CocoSSD } from './99-models/cocossd.js'

const app = new Hono()

app.route('/detection', detectionRouter)

// Initialize Models
;(async (): Promise<void> => {
  await CocoSSD.init()
})()

serve({
  fetch: app.fetch,
  port: 49543,
})
