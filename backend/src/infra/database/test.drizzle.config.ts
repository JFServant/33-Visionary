import { defineConfig } from 'drizzle-kit'
import { env } from '../../env'

// ts-prune-ignore-next
export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/infra/database/schema/*',
  out: 'src/infra/database/migrations',
  dbCredentials: {
    host: env.TEST_DB_HOST,
    port: env.TEST_DB_PORT,
    database: env.TEST_DB_NAME,
    user: env.TEST_DB_USER,
    password: env.TEST_DB_PASSWORD,
    ssl: false,
  },
})
