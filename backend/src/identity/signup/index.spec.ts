import { describe, expect, it, mock } from 'bun:test'
import { eq } from 'drizzle-orm'
import { SignupUsecase } from '.'
import { customers } from '../../infra/database/schema/customer'
import { rollbackTXWrapper } from '../../infra/database/test'
import { SignupHasher } from './hasher'
import type { ISignupPresenter } from './presenter/contract'
import { SignupRepository } from './repository'
import { SignupTokenizer } from './tokenizer'
import { SignupValidator } from './validator'

describe('SignupUsecase', () => {
  const MockedSignupPresenter: ISignupPresenter = {
    validationFail: mock(),
    emailAlreadyTaken: mock(),
    success: mock(),
  }

  const tokenizerConfig = { minutes: 1, secret: 'super_secret' }

  it("should call presenter.success and create a new customer when the customer's input is valid.", async () => {
    await rollbackTXWrapper(async (tx) => {
      const input = { username: 'username', email: 'a@b.com', password: 'Pa$$w0rd' }

      await new SignupUsecase(
        new SignupValidator(input),
        MockedSignupPresenter,
        new SignupRepository(tx),
        new SignupHasher(),
        new SignupTokenizer(tokenizerConfig)
      ).execute()

      const [customer] = await tx
        .select({ id: customers.id })
        .from(customers)
        .where(eq(customers.email, input.email))

      expect(customer).toBeDefined()

      expect(MockedSignupPresenter.success).toHaveBeenCalledWith({
        data: {
          sub: customer.id,
          token: expect.any(String),
        },
      })
    })
  })

  it("should call presenter.emailAlreadyTaken when the customer's input email is already taken.", async () => {
    await rollbackTXWrapper(async (tx) => {
      const input = { username: 'username', email: 'a@b.com', password: 'Pa$$w0rd' }

      await tx.insert(customers).values(input)

      await new SignupUsecase(
        new SignupValidator(input),
        MockedSignupPresenter,
        new SignupRepository(tx),
        new SignupHasher(),
        new SignupTokenizer(tokenizerConfig)
      ).execute()

      expect(MockedSignupPresenter.emailAlreadyTaken).toHaveBeenCalledWith({
        error: { message: 'Email already taken.' },
      })
    })
  })

  it("should call presenter.validationFail when the customer's input is invalid.", async () => {
    await rollbackTXWrapper(async (tx) => {
      const input = {}

      await new SignupUsecase(
        new SignupValidator(input),
        MockedSignupPresenter,
        new SignupRepository(tx),
        new SignupHasher(),
        new SignupTokenizer(tokenizerConfig)
      ).execute()

      expect(MockedSignupPresenter.validationFail).toHaveBeenCalledWith({
        error: { message: 'Signup input validation failed.' },
      })
    })
  })
})
