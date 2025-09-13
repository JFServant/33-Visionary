import type { ApiData, ApiError } from '../../../types'

export interface ILoginPresenter {
  validationFail(error: ApiError): Response
  invalidEmail(error: ApiError): Response
  invalidPassword(error: ApiError): Response
  success<T>(data: ApiData<T>): Response
}
