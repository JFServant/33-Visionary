import type { Context } from 'hono'
import { SignupUsecase } from '.'
import { env } from '../../00-global/env'
import { getTransaction, Transaction } from '../../01-infra/database/drizzle'
import { SignupHasher } from './hasher'
import { SignupPresenter } from './presenter'
import { SignupRepository } from './repository'
import { SignupTokenizer } from './tokenizer'
import { SignupValidator } from './validator'

export class SignupController {
  @Transaction()
  static async run(c: Context): Promise<Response> {
    return new SignupUsecase(
      new SignupValidator(await c.req.json()),
      new SignupPresenter(c),
      new SignupRepository(getTransaction()),
      new SignupHasher(),
      new SignupTokenizer({ minutes: env.JWT_EXP_IN_MINUTES, secret: env.JWT_SECRET })
    ).execute()
  }
}
