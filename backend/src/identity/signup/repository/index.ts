import { eq } from 'drizzle-orm'
import type { DrizzleTransaction } from '../../../infra/database/drizzle.types'
import { customers } from '../../../infra/database/schema/customer'
import type { Customer, CustomerID, ISignupRepository } from './contract'

export class SignupRepository implements ISignupRepository {
  constructor(private readonly tx: DrizzleTransaction) {}

  async doesCustomerExist(email: string): Promise<boolean> {
    const rows = await this.tx
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.email, email))

    return rows.length > 0
  }

  async createCustomer(customer: Customer): Promise<CustomerID> {
    const [{ customerID }] = await this.tx
      .insert(customers)
      .values(customer)
      .returning({ customerID: customers.id })

    return customerID
  }
}
