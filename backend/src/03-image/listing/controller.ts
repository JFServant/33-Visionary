import type { Context } from 'hono'
import { ListingUsecase } from '.'
import { Authenticator } from '../../01-infra/authenticator'
import { getTransaction, Transaction } from '../../01-infra/database/main/drizzle'
import { ListingMemory } from './memory'
import { ListingPresenter } from './presenter'
import { ListingRepository } from './repository'
import { ListingStore } from './store'

export class ListingController {
  @Transaction()
  static run({ json, get }: Context): Promise<Response> {
    const tx = getTransaction()
    const customerID = Authenticator.getCustomerID(get)

    return new ListingUsecase(
      new ListingMemory('listing'),
      new ListingPresenter(json),
      new ListingRepository(tx),
      new ListingStore('images')
    ).execute(customerID)
  }
}
