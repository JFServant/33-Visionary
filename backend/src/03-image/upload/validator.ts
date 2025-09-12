import type { ValidationFail } from '../../00-global/types'

// Contract
type ValidationSuccess = { success: true; image: File }
type Output = ValidationSuccess | ValidationFail

export interface IUploadValidator {
  parse(): Output
}

// Concrete
export class UploadValidator implements IUploadValidator {
  constructor(private readonly input: unknown) {}

  parse(): Output {
    try {
      if (!this.isFormData(this.input)) throw 'Wrong format.'

      const image = this.input.get('image')

      if (!this.isFileProvided(image)) throw 'Missing file.'
      if (!this.isImageType(image)) throw 'Wrong type.'
      if (!this.isSizeUnder10MB(image)) throw 'Max 10MB.'

      return { success: true, image }
    } catch {
      return { success: false, error: { message: 'Image Upload input validation failed.' } }
    }
  }

  private isFormData(input: unknown): input is FormData {
    return input instanceof FormData
  }

  private isFileProvided(input: FormDataEntryValue | null): input is File {
    return !!input && input instanceof File
  }

  private isImageType(input: File): boolean {
    return input.type.startsWith('image/')
  }

  private isSizeUnder10MB(image: File): boolean {
    return image.size <= 10 * 1024 * 1024
  }
}
