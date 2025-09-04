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
  constructor(private readonly c: Context) {}

  validationFail(error: ApiError): Response {
    return this.c.json(error, 400)
  }

  success(data: Data): Response {
    return this.c.json(data, 201)
  }
}
