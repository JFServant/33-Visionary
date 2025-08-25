import type { drizzle } from 'drizzle-orm/node-postgres'

type DrizzleClient = ReturnType<typeof drizzle>
type DrizzleTransactionCallback = Parameters<DrizzleClient['transaction']>[0]
export type DrizzleTransaction = Parameters<DrizzleTransactionCallback>[0]
