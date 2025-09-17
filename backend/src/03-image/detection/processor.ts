import type { Rank, Tensor } from '@tensorflow/tfjs-node'
import { node } from '@tensorflow/tfjs-node'
import { DetectionModel } from './model'

// Contract
type Prediction = {
  x: number
  y: number
  width: number
  height: number
  classification: string
  confidence: number
}

export interface IDetectionProcessor {
  predict(image: Buffer): Promise<Prediction[] | null>
}

// Concrete
type Tensor3D = Tensor<Rank.R3>
type Tensor4D = Tensor<Rank.R4>

export class DetectionProcessor implements IDetectionProcessor {
  async predict(image: Buffer): Promise<Prediction[] | null> {
    let tensor: Tensor3D | Tensor4D | null = null

    try {
      tensor = node.decodeImage(image, 3)

      if (!this.isTensor3D(tensor)) throw 'Not Tensor3D.'

      const model = await DetectionModel.getModel()
      const predictions = await model.detect(tensor)

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
