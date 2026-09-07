import { Model } from '../../../01-infra/model'
import type { IDetectionGateway, Input, Prediction } from './contract'

const MIME_BY_EXTENSION: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
}

export class DetectionGateway implements IDetectionGateway {
  async predict({ image, internalName }: Input): Promise<Prediction[] | null> {
    const mimeType = this.resolveMimeType(internalName)

    if (!mimeType) return null

    const uint8Array = new Uint8Array(image)
    const file = new File([uint8Array], internalName, { type: mimeType })

    const formData = new FormData()
    formData.append('image', file)

    const { data } = await Model.request<Prediction[]>({
      domain: 'detection',
      model: 'cocossd',
      body: formData,
    })

    return data
  }

  private resolveMimeType(internalName: string): string | null {
    const segments = internalName.split('.')

    if (segments.length < 2) return null

    const extension = segments[segments.length - 1].toLowerCase()

    return MIME_BY_EXTENSION[extension] ?? null
  }
}
