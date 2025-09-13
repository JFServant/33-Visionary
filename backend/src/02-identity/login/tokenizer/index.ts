import { Authenticator } from '../../../01-infra/authenticator'
import type { ILoginTokenizer, Token } from './contract'

export class LoginTokenizer implements ILoginTokenizer {
  sign(customerID: string): Promise<Token> {
    return Authenticator.sign({ sub: customerID })
  }
}
