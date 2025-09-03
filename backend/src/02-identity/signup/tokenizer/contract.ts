export type Token = string

export interface ISignupTokenizer {
  sign(customerID: string): Promise<Token>
}
