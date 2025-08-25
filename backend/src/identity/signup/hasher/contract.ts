export type HashedPassword = string

export interface ISignupHasher {
  hash(rawPassword: string): Promise<HashedPassword>
}
