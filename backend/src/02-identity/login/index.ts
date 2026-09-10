import type { ILoginHasher } from './hasher/contract'
import type { ILoginPresenter } from './presenter/contract'
import type { ILoginRepository } from './repository/contract'
import type { ILoginTokenizer } from './tokenizer/contract'
import type { ILoginValidator } from './validator/contract'

const DUMMY_HASH =
  '$argon2id$v=19$m=65536,t=3,p=2$L9uWrxhnjZW2tcEGbqjc2w$4W82hrPQQAlevNJmjojFuUdfvk980inbFl3mt0csQ2c'

export class LoginUsecase {
  constructor(
    private readonly validator: ILoginValidator,
    private readonly presenter: ILoginPresenter,
    private readonly repository: ILoginRepository,
    private readonly hasher: ILoginHasher,
    private readonly tokenizer: ILoginTokenizer
  ) {}

  async execute(): Promise<Response> {
    const validation = this.validator.parse()

    if (!validation.success) {
      return this.presenter.validationFail({ error: validation.error })
    }

    const { email, password } = validation.data

    const customer = await this.repository.getCustomerBy(email)

    if (!customer) {
      await this.hasher.verify({ hash: DUMMY_HASH, password })

      return this.presenter.invalidEmail({ error: { message: 'Invalid credentials.' } })
    }

    const verified = await this.hasher.verify({ hash: customer.hash, password })

    if (!verified) {
      return this.presenter.invalidPassword({ error: { message: 'Invalid credentials.' } })
    }

    const token = await this.tokenizer.sign(customer.id)

    return this.presenter.success({ data: { sub: customer.id, token } })
  }
}
