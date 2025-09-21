import type { Context } from 'hono'
import type { Success } from '../../types'
import type { Image } from './contract'

// Contract
export interface IListingPresenter {
  success(data: Success<Image[]>): Response
  memory(data: Success<Image[]>): Response
}

// Concrete
export class ListingPresenter implements IListingPresenter {
  constructor(private readonly json: Context['json']) {}

  success(data: Success<Image[]>): Response {
    return this.json(data, 200)
  }

  memory(data: Success<Image[]>): Response {
    return this.json(data, 200)
  }
}
