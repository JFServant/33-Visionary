import { Model } from '../../01-infra/model'

// Contract
type Prediction = {
  x: number
  y: number
  width: number
  height: number
  classification: string
  confidence: number
}

type Data = Prediction[]

type Input = { image: Buffer; internalName: string }

export interface IDetectionGateway {
  predict(input: Input): Promise<Data | null>
}

// Concrete
export class DetectionGateway implements IDetectionGateway {
  async predict({ image, internalName }: Input): Promise<Data | null> {
    const uint8Array = new Uint8Array(image)
    const extension = internalName.split('.')[0]
    const file = new File([uint8Array], internalName, { type: `image/${extension}` })

    const formData = new FormData()
    formData.append('image', file)

    const { data } = await Model.request<Data>({
      domain: 'detection',
      model: 'cocossd',
      body: formData,
    })

    return data
  }
}
