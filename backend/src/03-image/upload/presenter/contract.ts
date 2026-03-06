import type { Failure, Success } from '../../../types'

export interface IUploadPresenter {
  validationFail(error: Failure): Response
  success<T>(data: Success<T>): Response
}
