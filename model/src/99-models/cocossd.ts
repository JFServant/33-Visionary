import type { ObjectDetection } from '@tensorflow-models/coco-ssd'
import { load } from '@tensorflow-models/coco-ssd'

export class CocoSSD {
  private static model: ObjectDetection | null = null

  static async init(): Promise<void> {
    this.model = await load({ base: 'mobilenet_v2' })
  }

  static async getModel(): Promise<ObjectDetection> {
    if (!this.model) await this.init()
    return this.model!
  }
}
