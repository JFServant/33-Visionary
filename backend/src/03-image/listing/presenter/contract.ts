import type { Success } from '../../../types'
import type { Page } from '../contract'

export interface IListingPresenter {
  success(data: Success<Page>): Response
  memory(data: Success<Page>): Response
}
