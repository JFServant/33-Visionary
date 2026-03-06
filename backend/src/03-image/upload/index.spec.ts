import { afterEach, describe, expect, it, mock } from 'bun:test'
import { readdirSync, readFileSync, unlinkSync } from 'fs'
import { join } from 'path'
import { UploadUsecase } from '.'
import type { IUploadPresenter } from './presenter/contract'
import type { IUploadQueuer } from './queuer/contract'
import { UploadStorer } from './storer'
import { UploadValidator } from './validator'

type FactoryConfig = { input: FormData; presenter: IUploadPresenter; queuer: IUploadQueuer }

const factory = async ({ input, presenter, queuer }: FactoryConfig): Promise<void> => {
  await new UploadUsecase(
    new UploadValidator(input),
    presenter,
    new UploadStorer('tmp-test'),
    queuer
  ).execute('customerID')
}

type FileBuilderConfig = {
  name: 'dog.jpg' | 'text.txt'
  type: 'image/jpeg' | 'text/plain'
}

const fileBuilder = ({ name, type }: FileBuilderConfig): FormData => {
  const path = join(__dirname, 'tmp-test', name)
  const buffer = readFileSync(path)

  const image = new File([buffer], name, { type })

  const formData = new FormData()
  formData.append('image', image)

  return formData
}

const fileCleaner = (): void => {
  const folder = join(__dirname, 'tmp-test')
  const files = readdirSync(folder)
  const filesToDelete = files.filter((file) => file !== 'dog.jpg' && file !== 'text.txt')

  for (const file of filesToDelete) unlinkSync(join(folder, file))
}

describe('UploadUsecase', () => {
  const MockedUploadPresenter: IUploadPresenter = {
    validationFail: mock(),
    success: mock(),
  }

  const MockedUploadQueuer: IUploadQueuer = {
    detection: mock(),
  }

  const VALID_INPUT = fileBuilder({ name: 'dog.jpg', type: 'image/jpeg' })
  const INVALID_INPUT = fileBuilder({ name: 'text.txt', type: 'text/plain' })

  afterEach(() => {
    mock.clearAllMocks()
  })

  it("should call presenter.success & queuer.detection when the customer's input is valid.", async () => {
    await factory({
      input: VALID_INPUT,
      presenter: MockedUploadPresenter,
      queuer: MockedUploadQueuer,
    })

    expect(MockedUploadPresenter.success).toHaveBeenCalledWith({ data: true })

    expect(MockedUploadQueuer.detection).toHaveBeenCalledWith({
      tmpPath: expect.any(String),
      originalName: expect.any(String),
      internalName: expect.any(String),
      customerID: expect.any(String),
    })

    fileCleaner()
  })

  it("should only call presenter.validationFail when the customer's input is invalid.", async () => {
    await factory({
      input: INVALID_INPUT,
      presenter: MockedUploadPresenter,
      queuer: MockedUploadQueuer,
    })

    expect(MockedUploadPresenter.validationFail).toHaveBeenCalledWith({
      error: { message: 'Image Upload input validation failed.' },
    })

    expect(MockedUploadQueuer.detection).not.toHaveBeenCalled()
  })
})
