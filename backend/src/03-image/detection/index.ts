import type { IDetectionGateway } from './gateway'
import type { IDetectionMemory } from './memory'
import type { IDetectionPresenter } from './presenter'
import type { IDetectionRepository } from './repository'
import type { IDetectionStorer } from './storer'

type Input = {
  tmpPath: string
  originalName: string
  internalName: string
  customerID: string
}

export class DetectionUsecase {
  constructor(
    private readonly storer: IDetectionStorer,
    private readonly gateway: IDetectionGateway,
    private readonly presenter: IDetectionPresenter,
    private readonly repository: IDetectionRepository,
    private readonly memory: IDetectionMemory
  ) {}

  async execute({ tmpPath, originalName, internalName, customerID }: Input): Promise<void> {
    const image = await this.storer.getLocalImage(tmpPath)

    const predictions = await this.gateway.predict({ image, internalName })

    if (!predictions) {
      await this.storer.deleteLocalImage(tmpPath)

      return this.presenter.detectionFail('failure')
    }

    const imageID = await this.repository.createImage({ originalName, internalName, customerID })
    await this.repository.createPredictions(predictions.map((p) => ({ ...p, imageID })))

    await this.storer.sendImageToBucket({ internalName, image })
    await this.storer.deleteLocalImage(tmpPath)

    await this.memory.clearImages(customerID)

    return this.presenter.success('success')
  }
}
