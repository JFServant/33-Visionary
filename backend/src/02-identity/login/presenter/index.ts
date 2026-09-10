import type { Context } from 'hono'
import type { Failure, Success } from '../../../types'
import type { ILoginPresenter } from './contract'

export class LoginPresenter implements ILoginPresenter {
  constructor(private readonly json: Context['json']) {}

  validationFail(error: Failure): Response {
    return this.json(error, 400)
  }

  invalidEmail(error: Failure): Response {
    return this.json(error, 401)
  }

  invalidPassword(error: Failure): Response {
    return this.json(error, 401)
  }

  success<T>(data: Success<T>): Response {
    return this.json(data, 200)
  }
}
