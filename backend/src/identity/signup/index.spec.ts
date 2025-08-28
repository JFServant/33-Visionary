import { describe, expect, it, mock } from 'bun:test'
import { SignupUsecase } from '.'
import type { DrizzleTransaction } from '../../infra/database/drizzle.types'
import { customers } from '../../infra/database/schema/customer'
import { rollbackTXWrapper } from '../../infra/database/test.drizzle'
import { SignupHasher } from './hasher'
import type { ISignupPresenter } from './presenter/contract'
import { SignupRepository } from './repository'
import { SignupTokenizer } from './tokenizer'
import { SignupValidator } from './validator'

type Config = { presenter: ISignupPresenter; input: unknown; tx: DrizzleTransaction }

const factory = async ({ presenter, input, tx }: Config): Promise<void> => {
  await new SignupUsecase(
    new SignupValidator(input),
    presenter,
    new SignupRepository(tx),
    new SignupHasher(),
    new SignupTokenizer({ minutes: 1, secret: 'super_secret' })
  ).execute()
}

describe('SignupUsecase', () => {
  const MockedSignupPresenter: ISignupPresenter = {
    validationFail: mock(),
    emailAlreadyTaken: mock(),
    success: mock(),
  }

  const INVALID_INPUT = {}
  const EMAIL_ALREADY_TAKEN_INPUT = { username: 'username', email: 'a@b.com', password: 'Pa$$w0rd' }
  const VALID_INPUT = { username: 'username', email: 'a@b.com', password: 'Pa$$w0rd' }

  it("should call presenter.success when the customer's input is valid.", async () => {
    await rollbackTXWrapper(async (tx) => {
      await factory({ presenter: MockedSignupPresenter, input: VALID_INPUT, tx })

      expect(MockedSignupPresenter.success).toHaveBeenCalledWith({
        data: {
          sub: expect.any(String),
          token: expect.any(String),
        },
      })
    })
  })

  it("should call presenter.emailAlreadyTaken when the customer's input email is already taken.", async () => {
    await rollbackTXWrapper(async (tx) => {
      await tx.insert(customers).values(EMAIL_ALREADY_TAKEN_INPUT)

      await factory({ presenter: MockedSignupPresenter, input: EMAIL_ALREADY_TAKEN_INPUT, tx })

      expect(MockedSignupPresenter.emailAlreadyTaken).toHaveBeenCalledWith({
        error: { message: 'Email already taken.' },
      })
    })
  })

  it("should call presenter.validationFail when the customer's input is invalid.", async () => {
    await rollbackTXWrapper(async (tx) => {
      await factory({ presenter: MockedSignupPresenter, input: INVALID_INPUT, tx })

      expect(MockedSignupPresenter.validationFail).toHaveBeenCalledWith({
        error: { message: 'Signup input validation failed.' },
      })
    })
  })
})
