import type { Context } from 'hono'
import type { ApiData, ApiError } from '../../../types'
import type { ILoginPresenter } from './contract'

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

  success<T>(data: ApiData<T>): Response {
    return this.json(data, 200)
  }
}
