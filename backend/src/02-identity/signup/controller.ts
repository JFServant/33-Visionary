import type { Context } from 'hono'
import { SignupUsecase } from '.'
import { getTransaction, Transaction } from '../../01-infra/database/drizzle'
import { SignupHasher } from './hasher'
import { SignupPresenter } from './presenter'
import { SignupRepository } from './repository'
import { SignupTokenizer } from './tokenizer'
import { SignupValidator } from './validator'

export class SignupController {
  @Transaction()
  static async run({ req, json }: Context): Promise<Response> {
    const body = await req.json().catch(Error)
    const tx = getTransaction()

    return new SignupUsecase(
      new SignupValidator(body),
      new SignupPresenter(json),
      new SignupRepository(tx),
      new SignupHasher(),
      new SignupTokenizer()
    ).execute()
  }
}
