import { eq } from 'drizzle-orm'
import { images } from '../../01-infra/database/schema'
import type { DrizzleTransaction } from '../../types'
import type { Image } from './contract'

// Contract
type RepoImage = {
  id: string
  internalName: string
  predictions: Image['predictions']
}

export interface IListingRepository {
  getImagesBy(customerID: string): Promise<RepoImage[]>
}

// Concrete
export class ListingRepository implements IListingRepository {
  constructor(private readonly tx: DrizzleTransaction) {}

  getImagesBy(customerID: string): Promise<RepoImage[]> {
    return this.tx.query.images.findMany({
      columns: { id: true, internalName: true },
      where: eq(images.customerID, customerID),
      with: {
        predictions: {
          columns: {
            id: true,
            x: true,
            y: true,
            width: true,
            height: true,
            classification: true,
            confidence: true,
          },
        },
      },
    })
  }
}
