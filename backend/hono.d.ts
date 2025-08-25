import 'hono'

declare module 'hono' {
  interface ContextVariableMap {
    customerID?: string
  }
}
