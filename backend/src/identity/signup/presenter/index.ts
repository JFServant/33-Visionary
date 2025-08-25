import type { Context } from 'hono'
import type { Data, Error, ISignupPresenter } from './contract'

export class SignupPresenter implements ISignupPresenter {
  constructor(private readonly c: Context) {}

  validationFail(error: Error): Response {
    return this.c.json(error, 400)
  }

  emailAlreadyTaken(error: Error): Response {
    return this.c.json(error, 400)
  }

  success(data: Data): Response {
    return this.c.json(data, 201)
  }
}
