import type { IDetectionPresenter } from './presenter'
import type { IDetectionProcessor } from './processor'
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
    private readonly processor: IDetectionProcessor,
    private readonly presenter: IDetectionPresenter,
    private readonly repository: IDetectionRepository
  ) {}

  async execute({ tmpPath, originalName, internalName, customerID }: Input): Promise<void> {
    const buffer = await this.storer.getLocalImage(tmpPath)

    const predictions = await this.processor.predict(buffer)

    if (!predictions) {
      return this.presenter.detectionFail({
        error: { message: 'Fail to detect any subject on the image.' },
      })
    }

    const imageID = await this.repository.createImage({ originalName, internalName, customerID })

    await this.repository.createPredictions(predictions.map((p) => ({ ...p, imageID })))
    await this.storer.sendImageToBucket({ internalName, image: buffer })
    await this.storer.deleteLocalImage(tmpPath)

    return this.presenter.success({ data: true })
  }
}
