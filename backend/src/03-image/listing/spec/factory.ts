import { readFile } from 'fs/promises'
import { join } from 'path'
import { ListingUsecase } from '..'
import { images, predictions } from '../../../01-infra/database/schema'
import { customers } from '../../../01-infra/database/schema/customer'
import { S3Manager } from '../../../01-infra/s3/manager'
import type { DrizzleTransaction } from '../../../types'
import type { Direction } from '../contract'
import { ListingEncoder } from '../encoder'
import { ListingMemory } from '../memory'
import type { IListingPresenter } from '../presenter/contract'
import { ListingRepository } from '../repository'
import { ListingStorer } from '../storer'

const FILE_NAME = 'test.jpg'

type SeedConfig = {
  tx: DrizzleTransaction
  customerID: string
  count: number
}

type RunConfig = {
  tx: DrizzleTransaction
  presenter: IListingPresenter
  customerID: string
  cursor?: string | null
  direction?: Direction
}

export const seed = async ({ tx, customerID, count }: SeedConfig): Promise<void> => {
  await tx
    .insert(customers)
    .values({ id: customerID, username: 'username', password: 'password', email: 'email' })

  for (let n = 0; n < count; n++) {
    const [{ imageID }] = await tx
      .insert(images)
      .values({ originalName: FILE_NAME, internalName: `${FILE_NAME}-${n}`, customerID })
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
  }

  const file = await readFile(join(__dirname, FILE_NAME))
  await S3Manager.putObject({ bucket: 'test', fileName: FILE_NAME, file })
}

export const run = ({
  tx,
  presenter,
  customerID,
  cursor = null,
  direction = 'first',
}: RunConfig): Promise<Response> =>
  new ListingUsecase(
    new ListingMemory('test'),
    presenter,
    new ListingRepository(tx),
    new ListingStorer('test'),
    new ListingEncoder()
  ).execute({ customerID, cursor, direction })
