import type { IListingMemory } from './memory'
import type { IListingPresenter } from './presenter'
import type { IListingRepository } from './repository'
import type { IListingStore } from './store'

const TTL = 3600 // 1h

export class ListingUsecase {
  constructor(
    private readonly memory: IListingMemory,
    private readonly presenter: IListingPresenter,
    private readonly repository: IListingRepository,
    private readonly store: IListingStore
  ) {}

  async execute(customerID: string): Promise<Response> {
    const cache = await this.memory.findImagesBy(customerID)

    if (cache) return this.presenter.memory({ data: cache })

    const images = await this.repository.getImagesBy(customerID)

    const format = await Promise.all(
      images.map(async ({ id, internalName, predictions }) => ({
        id,
        url: await this.store.getSignedUrl({ fileName: internalName, ttl: TTL }),
        predictions,
      }))
    )

    await this.memory.cacheImages({ customerID, images: format, ttl: TTL })

    return this.presenter.success({ data: format })
  }
}
