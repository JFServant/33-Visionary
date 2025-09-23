import type { Context, Next } from 'hono'
import type { Failure } from '../signature.js'
import { env } from './env.js'

export class Authenticator {
  static async guard({ req, json: response }: Context, next: Next): Promise<Response | void> {
    const header = req.header('System-Authorization')

    if (!Authenticator.hasSecret(header)) {
      return response(
        { error: { message: 'System-Authorization header is missing.' } } satisfies Failure,
        401
      )
    }

    const secret = header.split(' ')[1]

    if (!Authenticator.matchSecret(secret)) {
      return response({ error: { message: 'Secret mismatch.' } } satisfies Failure, 401)
    }

    return next()
  }

  private static hasSecret(input: string | undefined): input is string {
    return !!input?.startsWith('Secret ')
  }

  private static matchSecret(secret: string): boolean {
    return secret === env.MODEL_SECRET
  }
}
