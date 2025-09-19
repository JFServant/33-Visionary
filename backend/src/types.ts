import type { DrizzleClient } from './01-infra/database/main/drizzle'

export type Success<T> = { data: T }
export type Failure = { error: { message: string } }

type DrizzleTransactionCallback = Parameters<DrizzleClient['transaction']>[0]
export type DrizzleTransaction = Parameters<DrizzleTransactionCallback>[0]
