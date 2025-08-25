import { defineConfig } from 'drizzle-kit'
import { env } from '../../env'

// ts-prune-ignore-next
export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/infra/database/schema/*',
  out: 'src/infra/database/migrations',
  dbCredentials: {
    host: env.IS_DOCKER ? env.LOCAL_DB_HOST : 'localhost',
    port: env.LOCAL_DB_PORT,
    database: env.LOCAL_DB_NAME,
    user: env.LOCAL_DB_USER,
    password: env.LOCAL_DB_PASSWORD,
    ssl: false,
  },
})
