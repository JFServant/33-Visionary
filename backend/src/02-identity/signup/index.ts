import type { ISignupHasher } from './hasher/contract'
import type { ISignupPresenter } from './presenter/contract'
import type { ISignupRepository } from './repository/contract'
import type { ISignupTokenizer } from './tokenizer/contract'
import type { ISignupValidator } from './validator/contract'

export class SignupUsecase {
  constructor(
    private readonly validator: ISignupValidator,
    private readonly presenter: ISignupPresenter,
    private readonly repository: ISignupRepository,
    private readonly hasher: ISignupHasher,
    private readonly tokenizer: ISignupTokenizer
  ) {}

  async execute(): Promise<Response> {
    const validation = this.validator.parse()

    if (!validation.success) {
      return this.presenter.validationFail({ error: validation.error })
    }

    const { email, password: rawPassword, username } = validation.data

    const customerExists = await this.repository.doesCustomerExist(email)

    if (customerExists) {
      return this.presenter.emailAlreadyTaken({ error: { message: 'Email already taken.' } })
    }

    const hashedPassword = await this.hasher.hash(rawPassword)

    const customerID = await this.repository.createCustomer({
      username,
      email,
      password: hashedPassword,
    })

    const token = await this.tokenizer.sign(customerID)

    return this.presenter.success({ data: { sub: customerID, token } })
  }
}
