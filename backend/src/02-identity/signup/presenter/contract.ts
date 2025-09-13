import type { ApiData, ApiError } from '../../../types'

export interface ISignupPresenter {
  validationFail(error: ApiError): Response
  emailAlreadyTaken(error: ApiError): Response
  success<T>(data: ApiData<T>): Response
}
