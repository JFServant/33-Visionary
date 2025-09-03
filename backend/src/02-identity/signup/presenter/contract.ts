import type { ApiError } from '../../../00-global/types'

export type Data = { data: { sub: string; token: string } }

export interface ISignupPresenter {
  validationFail(error: ApiError): Response
  emailAlreadyTaken(error: ApiError): Response
  success(data: Data): Response
}
