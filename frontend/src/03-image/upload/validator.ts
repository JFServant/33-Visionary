import type { Failure, Success } from '../../types'

const isFileProvided = (file: File | null): file is File => !!file
const isImageType = (file: File): boolean => file.type.startsWith('image/')
const isSizeUnder10MB = (file: File): boolean => file.size <= 10 * 1024 * 1024

export const validator = (files: FileList | null): Success<File> | Failure => {
  const file = files && files[0]

  if (!isFileProvided(file)) return { error: { message: 'A file must be provided.' } }
  if (!isImageType(file)) return { error: { message: 'Only images are accepted.' } }
  if (!isSizeUnder10MB(file)) return { error: { message: 'The file must be under 10MB.' } }

  return { data: file }
}
