import * as argon2 from 'argon2'
import type { HashedPassword, ISignupHasher } from './contract'

export class SignupHasher implements ISignupHasher {
  hash(rawPassword: string): Promise<HashedPassword> {
    return argon2.hash(rawPassword, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 2,
    })
  }
}
