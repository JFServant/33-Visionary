import type { Context, Next } from 'hono'
import { sign, verify } from 'hono/jwt'
import type { Failure } from '../types'
import { env } from './env'

type Payload = { sub: string }
type Token = string

export class Authenticator {
  static sign(payload: Payload): Promise<Token> {
    return sign({ ...payload, exp: this.expiresIn(60) }, env.JWT_SECRET)
  }

  static async guard({ req, json, set }: Context, next: Next): Promise<Response | void> {
    try {
      const header = req.header('Authorization')

      if (!header?.startsWith('Bearer ')) throw 'Missing Bearer.'

      await Authenticator.authenticate(header.split(' ')[1], set)

      return next()
    } catch {
      return json({ error: { message: 'Unauthorized.' } } satisfies Failure, 401)
    }
  }

  static async guardStream({ req, json, set }: Context, next: Next): Promise<Response | void> {
    try {
      await Authenticator.authenticate(req.query('token'), set)

      return next()
    } catch {
      return json({ error: { message: 'Unauthorized.' } } satisfies Failure, 401)
    }
  }

  static getCustomerID(get: Context['get']): string {
    const customerID = get('customerID')

    if (!customerID) throw 'Dev logic fail.'

    return customerID
  }

  private static async authenticate(token: string | undefined, set: Context['set']): Promise<void> {
    if (!token) throw 'Missing token.'

    const payload = await verify(token, env.JWT_SECRET)

    if (typeof payload?.sub !== 'string') throw 'Dev logic fail.'

    set('customerID', payload.sub)
  }

  private static expiresIn(minutes: number): number {
    return Math.floor(Date.now() / 1000) + 60 * minutes
  }
}
