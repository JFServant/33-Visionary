import { images, predictions } from '../../../01-infra/database/schema'
import type { DrizzleTransaction } from '../../../types'
import type { IDetectionRepository, Image, ImageID, Prediction } from './contract'

export class DetectionRepository implements IDetectionRepository {
  constructor(private readonly tx: DrizzleTransaction) {}

  async createImage(input: Image): Promise<ImageID> {
    const [{ imageID }] = await this.tx
      .insert(images)
      .values(input)
      .returning({ imageID: images.id })

    return imageID
  }

  async createPredictions(input: Prediction[]): Promise<void> {
    await this.tx.insert(predictions).values(input)
  }
}
