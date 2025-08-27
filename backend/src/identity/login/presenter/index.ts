import type { Context } from 'hono'
import type { Data, Error, ILoginPresenter } from './contract'

export class LoginPresenter implements ILoginPresenter {
  constructor(private readonly c: Context) {}

  validationFail(error: Error): Response {
    return this.c.json(error, 400)
  }

  invalidEmail(error: Error): Response {
    return this.c.json(error, 400)
  }

  invalidPassword(error: Error): Response {
    return this.c.json(error, 400)
  }

  success(data: Data): Response {
    return this.c.json(data, 200)
  }
}
