import * as argon2 from 'argon2'
import { describe, expect, it, mock } from 'bun:test'
import { LoginUsecase } from '.'
import type { DrizzleTransaction } from '../../infra/database/drizzle.types'
import { customers } from '../../infra/database/schema/customer'
import { rollbackTXWrapper } from '../../infra/database/test.drizzle'
import { LoginHasher } from './hasher'
import type { ILoginPresenter } from './presenter/contract'
import { LoginRepository } from './repository'
import { LoginTokenizer } from './tokenizer'
import { LoginValidator } from './validator'

type Config = {
  presenter: ILoginPresenter
  input: unknown
  tx: DrizzleTransaction
}

const factory = async ({ presenter, input, tx }: Config): Promise<void> => {
  await tx.insert(customers).values({
    username: 'username',
    email: 'a@b.com',
    password: await argon2.hash('Pa$$w0rd'),
  })

  await new LoginUsecase(
    new LoginValidator(input),
    presenter,
    new LoginRepository(tx),
    new LoginHasher(),
    new LoginTokenizer({ minutes: 1, secret: 'super_secret' })
  ).execute()
}

describe('LoginUsecase', () => {
  const MockedLoginPresenter: ILoginPresenter = {
    validationFail: mock(),
    invalidEmail: mock(),
    invalidPassword: mock(),
    success: mock(),
  }

  const INVALID_INPUT = {}
  const INVALID_EMAIL_INPUT = { email: 'WRONG@EMAIL.COM', password: 'Pa$$w0rd' }
  const INVALID_PASSWORD_INPUT = { email: 'a@b.com', password: 'Wr0ng_Pa$$w0rd' }
  const VALID_INPUT = { email: 'a@b.com', password: 'Pa$$w0rd' }

  it("should call presenter.success when the customer's input is valid.", async () => {
    await rollbackTXWrapper(async (tx) => {
      await factory({ presenter: MockedLoginPresenter, input: VALID_INPUT, tx })

      expect(MockedLoginPresenter.success).toHaveBeenCalledWith({
        data: {
          sub: expect.any(String),
          token: expect.any(String),
        },
      })
    })
  })

  it("should call presenter.invalidPassword when the customer's password is invalid.", async () => {
    await rollbackTXWrapper(async (tx) => {
      await factory({ presenter: MockedLoginPresenter, input: INVALID_PASSWORD_INPUT, tx })

      expect(MockedLoginPresenter.invalidPassword).toHaveBeenCalledWith({
        error: { message: 'Invalid credentials.' },
      })
    })
  })

  it("should call presenter.invalidEmail when the customer's email is invalid.", async () => {
    await rollbackTXWrapper(async (tx) => {
      await factory({ presenter: MockedLoginPresenter, input: INVALID_EMAIL_INPUT, tx })

      expect(MockedLoginPresenter.invalidEmail).toHaveBeenCalledWith({
        error: { message: 'Invalid credentials.' },
      })
    })
  })

  it("should call presenter.validationFail when the customer's input is invalid.", async () => {
    await rollbackTXWrapper(async (tx) => {
      await factory({ presenter: MockedLoginPresenter, input: INVALID_INPUT, tx })

      expect(MockedLoginPresenter.validationFail).toHaveBeenCalledWith({
        error: { message: 'Login input validation failed.' },
      })
    })
  })
})
