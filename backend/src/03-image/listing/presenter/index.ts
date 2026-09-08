import type { Context } from 'hono'
import type { Success } from '../../../types'
import type { Page } from '../contract'
import type { IListingPresenter } from './contract'

export class ListingPresenter implements IListingPresenter {
  constructor(private readonly json: Context['json']) {}

  success(data: Success<Page>): Response {
    return this.json(data, 200)
  }

  memory(data: Success<Page>): Response {
    return this.json(data, 200)
  }
}
