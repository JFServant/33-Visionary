import type { Failure, Success } from '../../../types'

export interface ISignupPresenter {
  validationFail(error: Failure): Response
  emailAlreadyTaken(error: Failure): Response
  success<T>(data: Success<T>): Response
}
