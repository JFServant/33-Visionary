import { Authenticator } from '../../../00-global/authenticator'
import type { ISignupTokenizer, Token } from './contract'

export class SignupTokenizer implements ISignupTokenizer {
  sign(customerID: string): Promise<Token> {
    return Authenticator.sign({ sub: customerID })
  }
}
