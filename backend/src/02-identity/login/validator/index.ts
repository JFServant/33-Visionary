import { z } from 'zod'
import type { ILoginValidator, Output } from './contract'

const schema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z
    .string()
    .trim()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
})

export class LoginValidator implements ILoginValidator {
  constructor(private readonly input: unknown) {}

  parse(): Output {
    const validation = schema.safeParse(this.input)

    if (!validation.success) {
      return { success: false, error: { message: 'Login input validation failed.' } }
    }

    return { success: true, data: validation.data }
  }
}
