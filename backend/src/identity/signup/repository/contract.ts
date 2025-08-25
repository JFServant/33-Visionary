export type Customer = {
  email: string
  password: string
  username: string
}

export type CustomerID = string

export interface ISignupRepository {
  doesCustomerExist(email: string): Promise<boolean>
  createCustomer(customer: Customer): Promise<CustomerID>
}
