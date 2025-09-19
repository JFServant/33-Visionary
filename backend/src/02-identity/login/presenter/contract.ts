import type { Failure, Success } from '../../../types'

export interface ILoginPresenter {
  validationFail(error: Failure): Response
  invalidEmail(error: Failure): Response
  invalidPassword(error: Failure): Response
  success<T>(data: Success<T>): Response
}
