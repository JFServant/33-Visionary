import type { Context, Next } from 'hono'
import { sign, verify } from 'hono/jwt'
import { env } from './env'
import type { ApiError } from './types'

type Payload = { sub: string }
type Token = string

export class Authenticator {
  static sign(payload: Payload): Promise<Token> {
    const expiresIn = (minutes: number): number => {
      return Math.floor(Date.now() / 1000) + 60 * minutes
    }

    return sign({ ...payload, exp: expiresIn(60) }, env.JWT_SECRET)
  }

  static async guard(c: Context, next: Next): Promise<Response | void> {
    const header = c.req.header('Authorization')

    const error: ApiError = { error: { message: 'Unauthorized.' } }

    if (!header?.startsWith('Bearer ')) return c.json(error, 401)

    const token = header.split(' ')[1]

    try {
      const payload = await verify(token, env.JWT_SECRET)

      if (typeof payload?.sub !== 'string') throw 'DEV_LOGIC_FAIL'

      c.set('customerID', payload.sub)

      return next()
    } catch {
      return c.json(error, 401)
    }
  }

  static getCustomerID(c: Context): string {
    const customerID = c.get('customerID')

    if (!customerID) throw 'DEV_LOGIC_FAIL'

    return customerID
  }
}
