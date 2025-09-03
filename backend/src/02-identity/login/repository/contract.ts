export type Customer = {
  id: string
  hash: string
}

export interface ILoginRepository {
  getCustomerBy(email: string): Promise<Customer | null>
}
