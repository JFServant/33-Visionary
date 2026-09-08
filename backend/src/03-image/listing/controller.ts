import type { Context } from 'hono'
import { ListingUsecase } from '.'
import { Authenticator } from '../../01-infra/authenticator'
import { getTransaction, Transaction } from '../../01-infra/database/main/drizzle'
import type { Direction } from './contract'
import { ListingEncoder } from './encoder'
import { ListingMemory } from './memory'
import { ListingPresenter } from './presenter'
import { ListingRepository } from './repository'
import { ListingStorer } from './storer'

const isDirection = (value: string | undefined): value is Direction =>
  value === 'first' || value === 'prev' || value === 'next' || value === 'last'

export class ListingController {
  @Transaction()
  static run({ json, get, req }: Context): Promise<Response> {
    const tx = getTransaction()
    const customerID = Authenticator.getCustomerID(get)

    const param = req.query('direction')
    const direction: Direction = isDirection(param) ? param : 'first'
    const cursor = req.query('cursor') ?? null

    return new ListingUsecase(
      new ListingMemory('listing'),
      new ListingPresenter(json),
      new ListingRepository(tx),
      new ListingStorer('images'),
      new ListingEncoder()
    ).execute({ customerID, cursor, direction })
  }
}
