import { images } from '../../01-infra/database/schema/image'
import { predictions } from '../../01-infra/database/schema/prediction'
import type { DrizzleTransaction } from '../../types'

// Contract
type Image = {
  originalName: string
  internalName: string
  customerID: string
}

type ImageID = string

type Prediction = {
  x: string
  y: string
  width: string
  height: string
  classification: string
  confidence: string
  imageID: string
}

export interface IDetectionRepository {
  createImage(input: Image): Promise<ImageID>
  createPredictions(input: Prediction[]): Promise<void>
}

// Concrete
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
