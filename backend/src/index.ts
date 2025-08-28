import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from './env'
import { identityRouter } from './identity/router'

const app = new Hono()

app.use(cors({ origin: env.CLIENT_URL }))

app.route('/identity', identityRouter)

// ts-prune-ignore-next
export default {
  port: env.API_PORT,
  fetch: app.fetch,
}
