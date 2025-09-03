import { sign } from 'hono/jwt'
import type { ISignupTokenizer, Token } from './contract'

type Config = { minutes: number; secret: string }

export class SignupTokenizer implements ISignupTokenizer {
  constructor(private readonly config: Config) {}

  sign(customerID: string): Promise<Token> {
    return sign({ sub: customerID, exp: this.unixExpIn(this.config.minutes) }, this.config.secret)
  }

  private unixExpIn(minutes: number): number {
    return Math.floor(Date.now() / 1000) + 60 * minutes
  }
}
