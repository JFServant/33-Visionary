import z from 'zod'

const envSchema = z.object({
  API_PORT: z.string().regex(/^\d+$/).transform(Number),

  LOCAL_DB_HOST: z.string(),
  LOCAL_DB_PORT: z.string().regex(/^\d+$/).transform(Number),
  LOCAL_DB_NAME: z.string(),
  LOCAL_DB_USER: z.string(),
  LOCAL_DB_PASSWORD: z.string(),

  TEST_DB_HOST: z.string(),
  TEST_DB_PORT: z.string().regex(/^\d+$/).transform(Number),
  TEST_DB_NAME: z.string(),
  TEST_DB_USER: z.string(),
  TEST_DB_PASSWORD: z.string(),

  IS_DOCKER: z
    .string()
    .regex(/^true|false$/)
    .transform((val) => val === 'true'),

  JWT_SECRET: z.string(),
  JWT_EXP_IN_MINUTES: z.string().regex(/^\d+$/).transform(Number),
})

export const env = envSchema.parse(process.env)
