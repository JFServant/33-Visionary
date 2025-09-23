import 'dotenv/config'
import z from 'zod'

const schema = z.object({
  API_URL: z.string().trim().nonempty(),
  MODEL_SECRET: z.string().trim().nonempty(),
})

export const env = schema.parse(process.env)
