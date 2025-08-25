import { z } from 'zod'
import type { ISignupValidator, Output } from './contract'

const schema = z.object({
  username: z.string().min(4),
  email: z.email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[a-z]/)
    .regex(/[0-9]/)
    .regex(/[^A-Za-z0-9]/),
})

export class SignupValidator implements ISignupValidator {
  constructor(private readonly input: unknown) {}

  parse(): Output {
    const validation = schema.safeParse(this.input)

    if (!validation.success) {
      return { success: false, error: { message: 'Signup input validation failed.' } }
    }

    return { success: true, data: validation.data }
  }
}
