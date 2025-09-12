import type { GetObjectCommandOutput } from '@aws-sdk/client-s3'
import {
  CreateBucketCommand,
  GetObjectCommand,
  ListBucketsCommand,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { s3Client } from './connection'

type Buckets = ['images', 'test']
export type BucketName = Buckets[number]

type PutObject = { bucket: BucketName; fileName: string; file: Buffer }
type GetObject = { bucket: BucketName; fileName: string }

export class S3Manager {
  private static buckets = ['images', 'test'] satisfies Buckets

  static async init(): Promise<void> {
    const { Buckets } = await s3Client.send(new ListBucketsCommand())

    const existingBuckets = new Set(Buckets?.map(({ Name }) => Name))

    for (const bucket of this.buckets) {
      if (existingBuckets.has(bucket)) continue

      await s3Client.send(new CreateBucketCommand({ Bucket: bucket }))
    }
  }

  static async putObject({ bucket, fileName, file }: PutObject): Promise<void> {
    await s3Client.send(new PutObjectCommand({ Bucket: bucket, Key: fileName, Body: file }))
  }

  static getObject({ bucket, fileName }: GetObject): Promise<GetObjectCommandOutput> {
    return s3Client.send(new GetObjectCommand({ Bucket: bucket, Key: fileName }))
  }
}
