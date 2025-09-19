import type { BucketName } from '../../01-infra/s3/manager'
import { S3Manager } from '../../01-infra/s3/manager'

// Contract
type Input = { fileName: string; ttl: number }

export interface IListingStore {
  getSignedUrl(input: Input): Promise<string>
}

// Concrete
export class ListingStore implements IListingStore {
  constructor(private readonly bucket: BucketName) {}

  getSignedUrl({ fileName, ttl }: Input): Promise<string> {
    return S3Manager.getSignedUrl({ bucket: this.bucket, fileName, ttl })
  }
}
