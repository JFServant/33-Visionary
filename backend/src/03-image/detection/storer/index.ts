import { readFile, unlink } from 'fs/promises'
import { Mime } from '../../../01-infra/mime'
import { S3Manager } from '../../../01-infra/s3/manager'
import type { BucketName } from '../../../01-infra/s3/manager'
import type { IDetectionStorer, Input } from './contract'

export class DetectionStorer implements IDetectionStorer {
  constructor(private readonly bucket: BucketName) {}

  getLocalImage(imagePath: string): Promise<Buffer> {
    return readFile(imagePath)
  }

  async sendImageToBucket({ internalName, image }: Input): Promise<void> {
    await S3Manager.putObject({
      bucket: this.bucket,
      fileName: internalName,
      file: image,
      contentType: Mime.resolve(internalName),
    })
  }

  async deleteLocalImage(imagePath: string): Promise<void> {
    await unlink(imagePath)
  }
}
