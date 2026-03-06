import type { BucketName } from '../../../01-infra/s3/manager'
import { S3Manager } from '../../../01-infra/s3/manager'
import type { IListingStorer, Input } from './contract'

export class ListingStorer implements IListingStorer {
  constructor(private readonly bucket: BucketName) {}

  getSignedUrl({ fileName, ttl }: Input): Promise<string> {
    return S3Manager.getSignedUrl({ bucket: this.bucket, fileName, ttl })
  }
}
