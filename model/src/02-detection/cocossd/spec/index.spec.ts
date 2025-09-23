import { deepStrictEqual, strictEqual } from 'node:assert'
import { beforeEach, describe, it, mock } from 'node:test'
import type { ICocoSSDPresenter } from '../presenter.js'
import { buildFormData, factory } from './factory.js'

describe('CocoSSDUsecase', async () => {
  const success = mock.fn<ICocoSSDPresenter['success']>()
  const noPrediction = mock.fn<ICocoSSDPresenter['noPrediction']>()
  const noImage = mock.fn<ICocoSSDPresenter['noImage']>()

  const MockedCocoSSDPresenter: ICocoSSDPresenter = { success, noPrediction, noImage }

  const SUCCESS_INPUT = buildFormData({ fileName: 'cat.jpg', fileType: 'image/jpeg' })
  const NO_PREDICTION_INPUT = buildFormData({ fileName: 'empty.jpg', fileType: 'image/jpeg' })
  const NO_IMAGE_INPUT = null

  beforeEach(() => {
    mock.reset()
  })

  it('should call presenter.success when the image is valid.', async () => {
    await factory({ input: SUCCESS_INPUT, presenter: MockedCocoSSDPresenter })

    const [call] = success.mock.calls
    const [argument] = call.arguments
    const [{ x, y, width, height, classification, confidence }] = argument.data

    strictEqual(typeof x, 'number')
    strictEqual(typeof y, 'number')
    strictEqual(typeof width, 'number')
    strictEqual(typeof height, 'number')
    strictEqual(typeof classification, 'string')
    strictEqual(typeof confidence, 'number')
  })

  it("should call presenter.noPrediction when the image can't be processed.", async () => {
    await factory({ input: NO_PREDICTION_INPUT, presenter: MockedCocoSSDPresenter })

    const [call] = noPrediction.mock.calls
    const [argument] = call.arguments

    deepStrictEqual(argument, { data: null })
  })

  it('should call presenter.noImage when no image is provided.', async () => {
    await factory({ input: NO_IMAGE_INPUT, presenter: MockedCocoSSDPresenter })

    const [call] = noImage.mock.calls
    const [argument] = call.arguments

    deepStrictEqual(argument, { data: null })
  })
})
