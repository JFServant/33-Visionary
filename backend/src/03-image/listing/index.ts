import type { Input, Page } from './contract'
import type { IListingEncoder } from './encoder/contract'
import type { IListingMemory } from './memory/contract'
import type { IListingPresenter } from './presenter/contract'
import type { IListingRepository, Scan } from './repository/contract'
import type { IListingStorer } from './storer/contract'

const SignedUrlTTLInSeconds = 3600
const CacheTTLBufferInSeconds = 600
const CacheTTLInSeconds = SignedUrlTTLInSeconds - CacheTTLBufferInSeconds
const PAGE_SIZE = 24

export class ListingUsecase {
  constructor(
    private readonly memory: IListingMemory,
    private readonly presenter: IListingPresenter,
    private readonly repository: IListingRepository,
    private readonly storer: IListingStorer,
    private readonly encoder: IListingEncoder
  ) {}

  async execute({ customerID, cursor, direction }: Input): Promise<Response> {
    const cachedPage = await this.memory.findImagesPage({ customerID, cursor, direction })
    if (cachedPage) return this.presenter.memory({ data: cachedPage })

    const { total, minID, maxID } = await this.repository.getImagesStats(customerID)
    const pageCount = Math.ceil(total / PAGE_SIZE)
    const lastPageSize = total - (pageCount - 1) * PAGE_SIZE

    const cursorID =
      cursor === null || direction === 'first' || direction === 'last'
        ? null
        : this.encoder.decode(cursor)

    const scan: Scan = direction === 'prev' || direction === 'last' ? 'backward' : 'forward'
    const limit = direction === 'last' ? lastPageSize : PAGE_SIZE

    const rows = await this.repository.getImagesPage({ customerID, cursorID, scan, limit })

    const images = await Promise.all(
      rows.map(async ({ id, internalName, predictions }) => ({
        id,
        url: await this.storer.getSignedUrl({ fileName: internalName, ttl: SignedUrlTTLInSeconds }),
        predictions,
      }))
    )

    const firstID = rows[0]?._id ?? null
    const lastID = rows[rows.length - 1]?._id ?? null
    const nextID = lastID === minID ? null : lastID
    const prevID = firstID === maxID ? null : firstID

    const page: Page = {
      images,
      nextCursor: nextID === null ? null : this.encoder.encode(nextID),
      prevCursor: prevID === null ? null : this.encoder.encode(prevID),
      pageCount,
    }

    await this.memory.cacheImagesPage({
      customerID,
      cursor,
      direction,
      page,
      ttl: CacheTTLInSeconds,
    })

    return this.presenter.success({ data: page })
  }
}
