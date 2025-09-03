import type { Context } from 'hono'
import type { ApiError } from '../../../00-global/types'
import type { Data, ILoginPresenter } from './contract'

export class LoginPresenter implements ILoginPresenter {
  constructor(private readonly c: Context) {}

  validationFail(error: ApiError): Response {
    return this.c.json(error, 400)
  }

  invalidEmail(error: ApiError): Response {
    return this.c.json(error, 400)
  }

  invalidPassword(error: ApiError): Response {
    return this.c.json(error, 400)
  }

  success(data: Data): Response {
    return this.c.json(data, 200)
  }
}
