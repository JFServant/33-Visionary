import { defineConfig } from 'drizzle-kit'
import { env } from '../../env'

// ts-prune-ignore-next
export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/infra/database/schema/*',
  out: 'src/infra/database/migrations',
  dbCredentials: {
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: false,
  },
})
