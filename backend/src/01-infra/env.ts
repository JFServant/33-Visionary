import z from 'zod'

const schema = z.object({
  CLIENT_URL: z.string().trim().nonempty(),
  MODEL_URL: z.string().trim().nonempty(),

  DB_HOST: z.string().trim().nonempty(),
  DB_PORT: z.string().trim().nonempty().regex(/^\d+$/).transform(Number),
  DB_NAME: z.string().trim().nonempty(),
  DB_USER: z.string().trim().nonempty(),
  DB_PASSWORD: z.string().trim().nonempty(),

  JWT_SECRET: z.string().trim().nonempty(),
  MODEL_SECRET: z.string().trim().nonempty(),

  REDIS_HOST: z.string().trim().nonempty(),
  REDIS_PORT: z.string().trim().nonempty().regex(/^\d+$/).transform(Number),
  REDIS_PASSWORD: z.string().trim().nonempty(),

  S3_ENDPOINT: z.string().trim().nonempty(),
  S3_REGION: z.string().trim().nonempty(),
  S3_ACCESS_KEY: z.string().trim().nonempty(),
  S3_SECRET_KEY: z.string().trim().nonempty(),

  RUN_ENV: z.literal(['production', 'staging', 'local']),
})

export const env = schema.parse(process.env)
