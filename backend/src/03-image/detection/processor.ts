import type { Rank, Tensor } from '@tensorflow/tfjs-node'
import { node } from '@tensorflow/tfjs-node'
import { DetectionModel } from './model'

// Contract
type Prediction = {
  x: string
  y: string
  width: string
  height: string
  classification: string
  confidence: string
}

export interface IDetectionProcessor {
  predict(image: Buffer): Promise<Prediction[] | null>
}

// Concrete
type Tensor3D = Tensor<Rank.R3>
type Tensor4D = Tensor<Rank.R4>

export class DetectionProcessor implements IDetectionProcessor {
  async predict(image: Buffer): Promise<Prediction[] | null> {
    const tensor = node.decodeImage(image, 3)

    try {
      if (!this.isTensor3D(tensor)) return null

      const model = DetectionModel.getModel()
      const predictions = await model.detect(tensor)

      const [height, width] = tensor.shape

      return predictions.map(({ bbox: [x1, y1, x2, y2], class: classification, score }) => ({
        x: this.toPercentage(x1 / width),
        y: this.toPercentage(y1 / height),
        width: this.toPercentage((x2 - x1) / width),
        height: this.toPercentage((y2 - y1) / height),
        classification,
        confidence: this.toPercentage(score),
      }))
    } finally {
      tensor.dispose()
    }
  }

  private isTensor3D(tensor: Tensor3D | Tensor4D): tensor is Tensor3D {
    return tensor.rank === 3
  }

  private toPercentage(num: number): string {
    return `${Math.round(num * 100)}%`
  }
}
