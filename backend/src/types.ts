import type { drizzle } from 'drizzle-orm/node-postgres'

export type ApiData<T> = { data: T }
export type ApiError = { error: { message: string } }

export type ValidationSuccess<T> = { success: true; data: T }
export type ValidationFail = { success: false; error: { message: string } }

type DrizzleClient = ReturnType<typeof drizzle>
type DrizzleTransactionCallback = Parameters<DrizzleClient['transaction']>[0]
export type DrizzleTransaction = Parameters<DrizzleTransactionCallback>[0]
