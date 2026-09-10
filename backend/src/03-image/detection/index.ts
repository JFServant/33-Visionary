import type { Outcome } from './contract'
import type { IDetectionGateway } from './gateway/contract'
import type { IDetectionMemory } from './memory/contract'
import type { IDetectionPresenter } from './presenter/contract'
import type { IDetectionRepository } from './repository/contract'
import type { IDetectionStorer } from './storer/contract'

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

  async execute({ tmpPath, originalName, internalName, customerID }: Input): Promise<Outcome> {
    const imageExists = await this.repository.imageExists(internalName)

    if (imageExists) return this.presenter.imageExists('skip')

    const image = await this.storer.getLocalImage(tmpPath)

    const predictions = await this.gateway.predict({ image, internalName })

    if (!predictions) {
      await this.storer.deleteLocalImage(tmpPath)

      return this.presenter.detectionFail('fail')
    }

    const imageID = await this.repository.createImage({ originalName, internalName, customerID })
    await this.repository.createPredictions(predictions.map((p) => ({ ...p, imageID })))

    await this.storer.sendImageToBucket({ internalName, image })
    await this.memory.clearImages(customerID)
    await this.storer.deleteLocalImage(tmpPath)

    return this.presenter.success('success')
  }
}
