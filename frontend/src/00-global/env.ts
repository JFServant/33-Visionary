import z from 'zod'

const schema = z.object({
  VITE_API_URL: z.string(),

  VITE_CLIENT_PORT: z.string().regex(/^\d+$/).transform(Number),
})

export const env = schema.parse(import.meta.env)
