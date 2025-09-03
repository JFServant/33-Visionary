export type Input = {
  hash: string
  password: string
}

export interface ILoginHasher {
  verify(input: Input): Promise<boolean>
}
