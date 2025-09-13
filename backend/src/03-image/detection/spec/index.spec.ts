import { describe, expect, it, mock } from 'bun:test'
import { eq } from 'drizzle-orm'
import { images } from '../../../01-infra/database/schema/image'
import { predictions } from '../../../01-infra/database/schema/prediction'
import { rollbackTXWrapper } from '../../../01-infra/database/test.drizzle'
import { S3Manager } from '../../../01-infra/s3/manager'
import type { IDetectionPresenter } from '../presenter'
import type { FileName } from './factory'
import { factory } from './factory'

describe('DetectionUsecase', async () => {
  const MockedDetectionPresenter: IDetectionPresenter = {
    success: mock(),
    detectionFail: mock(),
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
})
