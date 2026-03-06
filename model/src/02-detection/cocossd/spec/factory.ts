import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { CocoSSDUsecase } from '../index.js'
import type { ICocoSSDPresenter } from '../presenter/contract.js'
import { CocoSSDProcessor } from '../processor/index.js'
import { CocoSSDValidator } from '../validator/index.js'

type BuildFormDataConfig = {
  fileName: 'cat.jpg' | 'empty.jpg'
  fileType: 'image/jpeg'
}

export const buildFormData = ({ fileName, fileType }: BuildFormDataConfig): FormData => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = dirname(__filename)

  const path = join(__dirname, fileName)
  const buffer = readFileSync(path)

  const uint8Array = new Uint8Array(buffer)
  const image = new File([uint8Array], fileName, { type: fileType })

  const formData = new FormData()
  formData.append('image', image)

  return formData
}

type FactoryConfig = {
  input: unknown
  presenter: ICocoSSDPresenter
}

export const factory = async ({ input, presenter }: FactoryConfig): Promise<void> => {
  await new CocoSSDUsecase(new CocoSSDValidator(input), presenter, new CocoSSDProcessor()).execute()
}
