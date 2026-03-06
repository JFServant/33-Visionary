import type { Context } from 'hono'
import type { Success } from '../../../types'
import type { IListingPresenter, Image } from './contract'

export class ListingPresenter implements IListingPresenter {
  constructor(private readonly json: Context['json']) {}

  success(data: Success<Image[]>): Response {
    return this.json(data, 200)
  }

  memory(data: Success<Image[]>): Response {
    return this.json(data, 200)
  }
}
