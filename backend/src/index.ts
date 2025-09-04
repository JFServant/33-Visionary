import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { env } from './00-global/env'
import { identityRouter } from './02-identity/router'
import { imageRouter } from './03-image/router'

const app = new Hono()

app.use(cors({ origin: env.CLIENT_URL }))

app.route('/identity', identityRouter)
app.route('/image', imageRouter)

// ts-prune-ignore-next
export default {
  port: 49321,
  fetch: app.fetch,
}
