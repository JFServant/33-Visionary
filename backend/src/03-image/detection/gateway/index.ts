import { Model } from '../../../01-infra/model'
import type { IDetectionGateway, Input, Prediction } from './contract'

export class DetectionGateway implements IDetectionGateway {
  async predict({ image, internalName }: Input): Promise<Prediction[] | null> {
    const uint8Array = new Uint8Array(image)
    const extension = internalName.split('.')[0]
    const file = new File([uint8Array], internalName, { type: `image/${extension}` })

    const formData = new FormData()
    formData.append('image', file)

    const { data } = await Model.request<Prediction[]>({
      domain: 'detection',
      model: 'cocossd',
      body: formData,
    })

    return data
  }
}
