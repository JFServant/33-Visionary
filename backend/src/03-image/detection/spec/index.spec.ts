import { describe, expect, it, mock } from 'bun:test'
import { eq } from 'drizzle-orm'
import { images } from '../../../01-infra/database/schema/image'
import { predictions } from '../../../01-infra/database/schema/prediction'
import { rollbackTXWrapper } from '../../../01-infra/database/test/drizzle'
import { S3Manager } from '../../../01-infra/s3/manager'
import type { Outcome } from '../contract'
import type { IDetectionPresenter } from '../presenter/contract'
import type { FileName } from './factory'
import { factory, redeliver } from './factory'

describe('DetectionUsecase', async () => {
  const MockedDetectionPresenter: IDetectionPresenter = {
    success: mock((outcome: Outcome) => outcome),
    detectionFail: mock((outcome: Outcome) => outcome),
    imageExists: mock((outcome: Outcome) => outcome),
  }

  const VALID_INPUT: FileName = 'apple.jpg'
  const INVALID_INPUT: FileName = '1px.png'

  it('should call presenter.success when the image is valid.', async () => {
    await rollbackTXWrapper(async (tx) => {
      const { customerID, tmpFileName } = await factory({
        tx,
        presenter: MockedDetectionPresenter,
        fileName: VALID_INPUT,
      })

      const [image] = await tx
        .select({ id: images.id })
        .from(images)
        .where(eq(images.customerID, customerID))

      expect(image).toBeDefined()

      const [prediction] = await tx
        .select({ id: predictions.id })
        .from(predictions)
        .where(eq(predictions.imageID, image.id))

      expect(prediction).toBeDefined()

      const { $metadata } = await S3Manager.getObject({ bucket: 'test', fileName: tmpFileName })

      expect($metadata.httpStatusCode).toEqual(200)
      expect(MockedDetectionPresenter.success).toHaveBeenCalledWith('success')

      await S3Manager.deleteObject({ bucket: 'test', fileName: tmpFileName })
    })
  })

  it("should call presenter.detectionFail when the image can't be processed.", async () => {
    await rollbackTXWrapper(async (tx) => {
      await factory({
        tx,
        presenter: MockedDetectionPresenter,
        fileName: INVALID_INPUT,
      })

      expect(MockedDetectionPresenter.detectionFail).toHaveBeenCalledWith('fail')
    })
  })

  it('should not create a duplicate image when the same job is redelivered.', async () => {
    await rollbackTXWrapper(async (tx) => {
      const { customerID, tmpFileName } = await factory({
        tx,
        presenter: MockedDetectionPresenter,
        fileName: VALID_INPUT,
      })

      await redeliver({
        tx,
        presenter: MockedDetectionPresenter,
        customerID,
        fileName: VALID_INPUT,
      })

      const rows = await tx
        .select({ id: images.id })
        .from(images)
        .where(eq(images.internalName, tmpFileName))

      expect(rows).toHaveLength(1)
      expect(MockedDetectionPresenter.imageExists).toHaveBeenCalledWith('skip')

      await S3Manager.deleteObject({ bucket: 'test', fileName: tmpFileName })
    })
  })
})
