import { defineConfig } from 'drizzle-kit'
import { env } from '../../00-global/env'

// ts-prune-ignore-next
export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/01-infra/database/schema/*',
  out: 'src/01-infra/database/migrations',
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: false,
  },
})
