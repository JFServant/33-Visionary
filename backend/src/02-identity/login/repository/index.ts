import { eq } from 'drizzle-orm'
import { customers } from '../../../01-infra/database/schema/customer'
import type { DrizzleTransaction } from '../../../types'
import type { Customer, ILoginRepository } from './contract'

export class LoginRepository implements ILoginRepository {
  constructor(private readonly tx: DrizzleTransaction) {}

  async getCustomerBy(email: string): Promise<Customer | null> {
    const [customer] = await this.tx
      .select({ id: customers.id, hash: customers.password })
      .from(customers)
      .where(eq(customers.email, email))

    if (!customer) return null

    return customer
  }
}
