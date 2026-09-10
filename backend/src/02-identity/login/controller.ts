import type { Context } from 'hono'
import { LoginUsecase } from '.'
import { getTransaction, Transaction } from '../../01-infra/database/main/drizzle'
import { LoginHasher } from './hasher'
import { LoginPresenter } from './presenter'
import { LoginRepository } from './repository'
import { LoginTokenizer } from './tokenizer'
import { LoginValidator } from './validator'

export class LoginController {
  @Transaction()
  static async run({ req, json }: Context): Promise<Response> {
    const body = await req.json().catch(() => {})
    const tx = getTransaction()

    return new LoginUsecase(
      new LoginValidator(body),
      new LoginPresenter(json),
      new LoginRepository(tx),
      new LoginHasher(),
      new LoginTokenizer()
    ).execute()
  }
}
