import { Hono } from 'hono'
import { env } from './env'
import { identityRouter } from './identity/router'

const app = new Hono()

app.route('/identity', identityRouter)

// ts-prune-ignore-next
export default {
  port: env.API_PORT,
  fetch: app.fetch,
}
