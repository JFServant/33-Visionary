import { readFile, unlink } from 'fs/promises'
import type { BucketName } from '../../01-infra/s3/manager'
import { S3Manager } from '../../01-infra/s3/manager'

// Contract
type Input = { internalName: string; image: Buffer }

export interface IDetectionStorer {
  getLocalImage(imagePath: string): Promise<Buffer>
  sendImageToBucket(image: Input): Promise<void>
  deleteLocalImage(imagePath: string): Promise<void>
}

// Concrete
export class DetectionStorer implements IDetectionStorer {
  constructor(private readonly bucket: BucketName) {}

  getLocalImage(imagePath: string): Promise<Buffer> {
    return readFile(imagePath)
  }

  async sendImageToBucket({ internalName, image }: Input): Promise<void> {
    await S3Manager.putObject({ bucket: this.bucket, fileName: internalName, file: image })
  }

  async deleteLocalImage(imagePath: string): Promise<void> {
    await unlink(imagePath)
  }
}
