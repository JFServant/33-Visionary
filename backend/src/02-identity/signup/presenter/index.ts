import type { Context } from 'hono'
import type { Failure, Success } from '../../../types'
import type { ISignupPresenter } from './contract'

export class SignupPresenter implements ISignupPresenter {
  constructor(private readonly json: Context['json']) {}

  validationFail(error: Failure): Response {
    return this.json(error, 400)
  }

  emailAlreadyTaken(error: Failure): Response {
    return this.json(error, 400)
  }

  success<T>(data: Success<T>): Response {
    return this.json(data, 201)
  }
}
