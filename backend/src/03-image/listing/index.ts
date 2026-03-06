import type { IListingMemory } from './memory/contract'
import type { IListingPresenter } from './presenter/contract'
import type { IListingRepository } from './repository/contract'
import type { IListingStorer } from './storer/contract'

const TTLInSeconds = 3600

export class ListingUsecase {
  constructor(
    private readonly memory: IListingMemory,
    private readonly presenter: IListingPresenter,
    private readonly repository: IListingRepository,
    private readonly storer: IListingStorer
  ) {}

  async execute(customerID: string): Promise<Response> {
    const cache = await this.memory.findImagesBy(customerID)

    if (cache) return this.presenter.memory({ data: cache })

    const images = await this.repository.getImagesBy(customerID)

    const format = await Promise.all(
      images.map(async ({ id, internalName, predictions }) => ({
        id,
        url: await this.storer.getSignedUrl({ fileName: internalName, ttl: TTLInSeconds }),
        predictions,
      }))
    )

    await this.memory.cacheImages({ customerID, images: format, ttl: TTLInSeconds })

    return this.presenter.success({ data: format })
  }
}
