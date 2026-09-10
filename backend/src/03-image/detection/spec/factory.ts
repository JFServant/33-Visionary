import { file, write } from 'bun'
import { join } from 'path'
import { DetectionUsecase } from '..'
import { nanoid } from '../../../01-infra/database/nanoid'
import { customers } from '../../../01-infra/database/schema/customer'
import type { DrizzleTransaction } from '../../../types'
import { DetectionGateway } from '../gateway'
import { DetectionMemory } from '../memory'
import type { IDetectionPresenter } from '../presenter/contract'
import { DetectionRepository } from '../repository'
import { DetectionStorer } from '../storer'

export type FileName = '1px.png' | 'apple.jpg'

type FactoryConfig = {
  tx: DrizzleTransaction
  presenter: IDetectionPresenter
  fileName: FileName
}

type FactoryReturn = {
  customerID: string
  tmpFileName: string
}

type RedeliverConfig = {
  tx: DrizzleTransaction
  presenter: IDetectionPresenter
  customerID: string
  fileName: FileName
}

export const factory = async ({
  tx,
  presenter,
  fileName,
}: FactoryConfig): Promise<FactoryReturn> => {
  const [{ customerID }] = await tx
    .insert(customers)
    .values({ username: 'username', password: 'password', email: `${nanoid()}@email.com` })
    .returning({ customerID: customers.id })

  const localFile = file(join(__dirname, fileName))
  const tmpFileName = `tmp-${fileName}`
  const tmpPath = join(__dirname, tmpFileName)
  await write(tmpPath, localFile)

  await new DetectionUsecase(
    new DetectionStorer('test'),
    new DetectionGateway(),
    presenter,
    new DetectionRepository(tx),
    new DetectionMemory('test')
  ).execute({ tmpPath, originalName: fileName, internalName: tmpFileName, customerID })

  return { customerID, tmpFileName }
}

export const redeliver = async ({
  tx,
  presenter,
  customerID,
  fileName,
}: RedeliverConfig): Promise<void> => {
  const tmpFileName = `tmp-${fileName}`
  const tmpPath = join(__dirname, tmpFileName)

  await new DetectionUsecase(
    new DetectionStorer('test'),
    new DetectionGateway(),
    presenter,
    new DetectionRepository(tx),
    new DetectionMemory('test')
  ).execute({ tmpPath, originalName: fileName, internalName: tmpFileName, customerID })
}
