import type { Context } from 'hono'
import type { ApiData, ApiError } from '../../types'

// Contract
export interface IUploadPresenter {
  validationFail(error: ApiError): Response
  success<T>(data: ApiData<T>): Response
}

// Concrete
export class UploadPresenter implements IUploadPresenter {
  constructor(private readonly json: Context['json']) {}

  validationFail(error: ApiError): Response {
    return this.json(error, 400)
  }

  success<T>(data: ApiData<T>): Response {
    return this.json(data, 201)
  }
}
