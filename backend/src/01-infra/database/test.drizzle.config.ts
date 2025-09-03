import { defineConfig } from 'drizzle-kit'
import { env } from '../../00-global/env'

// ts-prune-ignore-next
export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/01-infra/database/schema/*',
  out: 'src/01-infra/database/migrations',
  dbCredentials: {
    host: env.TEST_DB_HOST,
    port: env.TEST_DB_PORT,
    database: env.TEST_DB_NAME,
    user: env.TEST_DB_USER,
    password: env.TEST_DB_PASSWORD,
    ssl: false,
  },
})
