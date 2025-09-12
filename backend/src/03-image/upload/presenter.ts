import type { Context } from 'hono'
import type { ApiError } from '../../00-global/types'

// Contract
type Data = { data: true }

export interface IUploadPresenter {
  validationFail(error: ApiError): Response
  success(data: Data): Response
}

// Concrete
export class UploadPresenter implements IUploadPresenter {
  constructor(private readonly json: Context['json']) {}

  validationFail(error: ApiError): Response {
    return this.json(error, 400)
  }

  success(data: Data): Response {
    return this.json(data, 201)
  }
}
