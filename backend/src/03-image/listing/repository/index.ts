import { and, asc, count, desc, eq, gt, lt, max, min } from 'drizzle-orm'
import { images } from '../../../01-infra/database/schema'
import type { DrizzleTransaction } from '../../../types'
import type { IListingRepository, Image, PageQuery, Stats } from './contract'

export class ListingRepository implements IListingRepository {
  constructor(private readonly tx: DrizzleTransaction) {}

  async getImagesStats(customerID: string): Promise<Stats> {
    const [row] = await this.tx
      .select({ total: count(), minID: min(images._id), maxID: max(images._id) })
      .from(images)
      .where(eq(images.customerID, customerID))

    return row
  }

  async getImagesPage({ customerID, cursorID, scan, limit }: PageQuery): Promise<Image[]> {
    const keyset =
      cursorID === null
        ? undefined
        : scan === 'backward'
          ? gt(images._id, cursorID)
          : lt(images._id, cursorID)

    const rows = await this.tx.query.images.findMany({
      columns: { _id: true, id: true, internalName: true },
      where: and(eq(images.customerID, customerID), keyset),
      orderBy: [scan === 'backward' ? asc(images._id) : desc(images._id)],
      limit,
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

    return scan === 'backward' ? rows.reverse() : rows
  }
}
