import z from 'zod'

const schema = z.object({
  API_PORT: z.string().regex(/^\d+$/).transform(Number),

  DB_HOST: z.string(),
  DB_PORT: z.string().regex(/^\d+$/).transform(Number),
  DB_NAME: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),

  TEST_DB_HOST: z.string(),
  TEST_DB_PORT: z.string().regex(/^\d+$/).transform(Number),
  TEST_DB_NAME: z.string(),
  TEST_DB_USER: z.string(),
  TEST_DB_PASSWORD: z.string(),

  JWT_SECRET: z.string(),
  JWT_EXP_IN_MINUTES: z.string().regex(/^\d+$/).transform(Number),
})

export const env = schema.parse(process.env)
