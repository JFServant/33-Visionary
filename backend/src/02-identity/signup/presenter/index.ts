import type { Context } from 'hono'
import type { ApiData, ApiError } from '../../../types'
import type { ISignupPresenter } from './contract'

export class SignupPresenter implements ISignupPresenter {
  constructor(private readonly json: Context['json']) {}

  validationFail(error: ApiError): Response {
    return this.json(error, 400)
  }

  emailAlreadyTaken(error: ApiError): Response {
    return this.json(error, 400)
  }

  success<T>(data: ApiData<T>): Response {
    return this.json(data, 201)
  }
}
