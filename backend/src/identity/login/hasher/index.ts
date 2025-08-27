import * as argon2 from 'argon2'
import type { ILoginHasher, Input } from './contract'

export class LoginHasher implements ILoginHasher {
  verify({ hash, password }: Input): Promise<boolean> {
    return argon2.verify(hash, password)
  }
}
