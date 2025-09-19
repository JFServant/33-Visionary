import type { Context } from 'hono'
import type { Failure, Success } from '../../types'

// Contract
export interface IUploadPresenter {
  validationFail(error: Failure): Response
  success<T>(data: Success<T>): Response
}

// Concrete
export class UploadPresenter implements IUploadPresenter {
  constructor(private readonly json: Context['json']) {}

  validationFail(error: Failure): Response {
    return this.json(error, 400)
  }

  success<T>(data: Success<T>): Response {
    return this.json(data, 201)
  }
}
