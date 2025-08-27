export type Token = string

export interface ILoginTokenizer {
  sign(customerID: string): Promise<Token>
}
