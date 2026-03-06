import type { Context } from 'hono'
import type { Success } from '../../../signature.js'
import type { ICocoSSDPresenter, Prediction } from './contract.js'

export class CocoSSDPresenter implements ICocoSSDPresenter {
  constructor(private readonly response: Context['json']) {}

  success(data: Success<Prediction[]>): Response {
    return this.response(data)
  }

  noPrediction(data: Success<null>): Response {
    return this.response(data)
  }

  noImage(data: Success<null>): Response {
    return this.response(data)
  }
}
