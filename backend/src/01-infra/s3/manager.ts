import type { GetObjectCommandOutput } from '@aws-sdk/client-s3'
import {
  CreateBucketCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListBucketsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl as getSignedS3Url } from '@aws-sdk/s3-request-presigner'
import { env } from '../env'
import { s3Client, s3SignedUrlClient } from './connection'

type Buckets = ['images', 'test']
export type BucketName = Buckets[number]

type PutObject = { bucket: BucketName; fileName: string; file: Buffer }
type GetObject = { bucket: BucketName; fileName: string }
type DeleteObject = { bucket: BucketName; fileName: string }
type GetSignedUrl = { bucket: BucketName; fileName: string; ttl: number }

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

  static async deleteObject({ bucket, fileName }: DeleteObject): Promise<void> {
    await s3Client.send(new DeleteObjectCommand({ Bucket: bucket, Key: fileName }))
  }

  static getSignedUrl({ bucket, fileName, ttl }: GetSignedUrl): Promise<string> {
    return getSignedS3Url(
      s3SignedUrlClient,
      new GetObjectCommand({ Bucket: bucket, Key: fileName }),
      {
        expiresIn: ttl,
      }
    )
  }

  static async flush(bucket: BucketName): Promise<void> {
    if (env.RUN_ENV !== 'local') return

    const { Contents } = await s3Client.send(new ListObjectsV2Command({ Bucket: bucket }))

    if (!Contents || !Contents.length) return

    await s3Client.send(
      new DeleteObjectsCommand({
        Bucket: bucket,
        Delete: {
          Objects: Contents.map(({ Key }) => ({ Key })),
          Quiet: true,
        },
      })
    )
  }
}
