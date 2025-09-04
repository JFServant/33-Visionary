import type { Context } from 'hono'
import { LoginUsecase } from '.'
import { getTransaction, Transaction } from '../../01-infra/database/drizzle'
import { LoginHasher } from './hasher'
import { LoginPresenter } from './presenter'
import { LoginRepository } from './repository'
import { LoginTokenizer } from './tokenizer'
import { LoginValidator } from './validator'

export class LoginController {
  @Transaction()
  static async run(c: Context): Promise<Response> {
    return new LoginUsecase(
      new LoginValidator(await c.req.json()),
      new LoginPresenter(c),
      new LoginRepository(getTransaction()),
      new LoginHasher(),
      new LoginTokenizer()
    ).execute()
  }
}
