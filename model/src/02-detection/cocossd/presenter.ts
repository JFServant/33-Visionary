import type { Context } from 'hono'
import type { Success } from '../../signature.js'
import type { Data } from './contract.js'

// Contract
export interface ICocoSSDPresenter {
  success(data: Success<Data>): Response
  noPrediction(data: Success<null>): Response
  noImage(data: Success<null>): Response
}

// Concrete
export class CocoSSDPresenter implements ICocoSSDPresenter {
  constructor(private readonly response: Context['json']) {}

  success(data: Success<Data>): Response {
    return this.response(data)
  }

  noPrediction(data: Success<null>): Response {
    return this.response(data)
  }

  noImage(data: Success<null>): Response {
    return this.response(data)
  }
}
