import type { Context } from 'hono'
import type { ApiError } from '../../../00-global/types'
import type { Data, ILoginPresenter } from './contract'

export class LoginPresenter implements ILoginPresenter {
  constructor(private readonly json: Context['json']) {}

  validationFail(error: ApiError): Response {
    return this.json(error, 400)
  }

  invalidEmail(error: ApiError): Response {
    return this.json(error, 400)
  }

  invalidPassword(error: ApiError): Response {
    return this.json(error, 400)
  }

  success(data: Data): Response {
    return this.json(data, 200)
  }
}
