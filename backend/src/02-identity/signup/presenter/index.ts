import type { Context } from 'hono'
import type { ApiError } from '../../../00-global/types'
import type { Data, ISignupPresenter } from './contract'

export class SignupPresenter implements ISignupPresenter {
  constructor(private readonly c: Context) {}

  validationFail(error: ApiError): Response {
    return this.c.json(error, 400)
  }

  emailAlreadyTaken(error: ApiError): Response {
    return this.c.json(error, 400)
  }

  success(data: Data): Response {
    return this.c.json(data, 201)
  }
}
