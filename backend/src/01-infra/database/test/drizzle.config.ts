import { defineConfig } from 'drizzle-kit'

// ts-prune-ignore-next
export default defineConfig({
  dialect: 'postgresql',
  schema: 'src/01-infra/database/schema/*',
  out: 'src/01-infra/database/migrations',
  dbCredentials: {
    host: 'localhost',
    port: 49323,
    database: 'test_db',
    user: 'test_user',
    password: 'test_pass',
    ssl: false,
  },
})
