import { readFile } from 'fs/promises'
import { join } from 'path'
import { ListingUsecase } from '..'
import { images, predictions } from '../../../01-infra/database/schema'
import { customers } from '../../../01-infra/database/schema/customer'
import { S3Manager } from '../../../01-infra/s3/manager'
import type { DrizzleTransaction } from '../../../types'
import { ListingMemory } from '../memory'
import type { IListingPresenter } from '../presenter/contract'
import { ListingRepository } from '../repository'
import { ListingStorer } from '../storer'

type FactoryConfig = {
  tx: DrizzleTransaction
  presenter: IListingPresenter
  customerID: string
}

const FILE_NAME = 'test.jpg'

export const factory = async ({ tx, presenter, customerID }: FactoryConfig): Promise<void> => {
  await tx
    .insert(customers)
    .values({ id: customerID, username: 'username', password: 'password', email: 'email' })

  const [{ imageID }] = await tx
    .insert(images)
    .values({ originalName: FILE_NAME, internalName: FILE_NAME, customerID })
    .returning({ imageID: images.id })

  await tx.insert(predictions).values({
    x: 0.1,
    y: 0.1,
    width: 0.1,
    height: 0.1,
    classification: 'classification',
    confidence: 0.1,
    imageID,
  })

  const file = await readFile(join(__dirname, FILE_NAME))
  await S3Manager.putObject({ bucket: 'test', fileName: FILE_NAME, file })

  await new ListingUsecase(
    new ListingMemory('test'),
    presenter,
    new ListingRepository(tx),
    new ListingStorer('test')
  ).execute(customerID)
}
