import type { Context, Next } from 'hono'
import { sign, verify } from 'hono/jwt'
import { env } from './env'
import type { ApiError } from './types'

type Payload = { sub: string }
type Token = string

export class Authenticator {
  static sign(payload: Payload): Promise<Token> {
    return sign({ ...payload, exp: this.expiresIn(60) }, env.JWT_SECRET)
  }

  static async guard({ req, json, set }: Context, next: Next): Promise<Response | void> {
    const header = req.header('Authorization')

    try {
      if (!header?.startsWith('Bearer ')) throw 'Missing Bearer.'

      const token = header.split(' ')[1]

      const payload = await verify(token, env.JWT_SECRET)

      if (typeof payload?.sub !== 'string') throw 'Dev logic fail.'

      set('customerID', payload.sub)

      return next()
    } catch {
      return json({ error: { message: 'Unauthorized.' } } satisfies ApiError, 401)
    }
  }

  static getCustomerID(get: Context['get']): string {
    const customerID = get('customerID')

    if (!customerID) throw 'Dev logic fail.'

    return customerID
  }

  private static expiresIn(minutes: number): number {
    return Math.floor(Date.now() / 1000) + 60 * minutes
  }
}
