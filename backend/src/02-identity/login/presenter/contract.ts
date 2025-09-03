import type { ApiError } from '../../../00-global/types'

export type Data = { data: { sub: string; token: string } }

export interface ILoginPresenter {
  validationFail(error: ApiError): Response
  invalidEmail(error: ApiError): Response
  invalidPassword(error: ApiError): Response
  success(data: Data): Response
}
