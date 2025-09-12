import type { ObjectDetection } from '@tensorflow-models/coco-ssd'
import { load } from '@tensorflow-models/coco-ssd'

export class DetectionModel {
  private static model: ObjectDetection | null = null

  static async init(): Promise<void> {
    if (this.model) return
    this.model = await load()
  }

  static getModel(): ObjectDetection {
    if (!this.model) throw new Error('No detection model.')
    return this.model
  }
}
