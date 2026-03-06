import type { Failure, Success } from '../../../types'

export type Validation = Success<File> | Failure

export interface IUploadValidator {
  parse(): Validation
}
