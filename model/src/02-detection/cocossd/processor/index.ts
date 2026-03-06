import { node, type Tensor3D, type Tensor4D } from '@tensorflow/tfjs-node'
import { CocoSSD } from '../../../99-models/cocossd.js'
import type { Data, ICocoSSDProcessor } from './contract.js'

export class CocoSSDProcessor implements ICocoSSDProcessor {
  async predict(image: Uint8Array): Promise<Data | null> {
    let tensor: Tensor3D | Tensor4D | null = null

    try {
      tensor = node.decodeImage(image, 3)

      if (!this.isTensor3D(tensor)) return null

      const model = await CocoSSD.getModel()
      const predictions = await model.detect(tensor)

      if (!predictions.length) return null

      const [height, width] = tensor.shape

      return predictions.map(({ bbox: [x1, y1, x2, y2], class: classification, score }) => ({
        x: this.normalize(x1 / width),
        y: this.normalize(y1 / height),
        width: this.normalize((x2 - x1) / width),
        height: this.normalize((y2 - y1) / height),
        classification,
        confidence: this.normalize(score),
      }))
    } catch {
      console.log(
        "If something fails here, it's critical, and must be addressed asap. We can consider adding real time Slack messaging for example."
      )
      return null
    } finally {
      if (tensor) tensor.dispose()
    }
  }

  private isTensor3D(tensor: Tensor3D | Tensor4D): tensor is Tensor3D {
    return tensor.rank === 3
  }

  private normalize(num: number): number {
    return Math.round(num * 100) / 100
  }
}
