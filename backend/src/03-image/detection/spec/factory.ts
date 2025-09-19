import { file, write } from 'bun'
import { join } from 'path'
import { DetectionUsecase } from '..'
import { customers } from '../../../01-infra/database/schema/customer'
import type { DrizzleTransaction } from '../../../types'
import { DetectionMemory } from '../memory'
import type { IDetectionPresenter } from '../presenter'
import { DetectionProcessor } from '../processor'
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

export const factory = async ({
  tx,
  presenter,
  fileName,
}: FactoryConfig): Promise<FactoryReturn> => {
  const [{ customerID }] = await tx
    .insert(customers)
    .values({ username: 'username', password: 'password', email: 'email' })
    .returning({ customerID: customers.id })

  const localFile = file(join(__dirname, fileName))
  const tmpFileName = `tmp-${fileName}`
  const tmpPath = join(__dirname, tmpFileName)
  await write(tmpPath, localFile)

  await new DetectionUsecase(
    new DetectionStorer('test'),
    new DetectionProcessor(),
    presenter,
    new DetectionRepository(tx),
    new DetectionMemory('test')
  ).execute({ tmpPath, originalName: fileName, internalName: tmpFileName, customerID })

  return { customerID, tmpFileName }
}
