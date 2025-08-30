import { z } from 'zod'

export const schema = z.object({
  username: z.string().trim().min(4, 'Must be at least 4 characters long.'),
  email: z.email('Must be a valid email.').trim().toLowerCase(),
  password: z
    .string()
    .trim()
    .min(8, 'Must be at least 8 characters long.')
    .regex(/[A-Z]/, 'Must contain at least one uppercase.')
    .regex(/[a-z]/, 'Must contain at least one lowercase.')
    .regex(/[0-9]/, 'Must contain at least one number.')
    .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character.'),
})

export type Schema = z.infer<typeof schema>
