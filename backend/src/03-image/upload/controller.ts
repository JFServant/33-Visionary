import type { Context } from 'hono'
import { UploadUsecase } from '.'
import { Authenticator } from '../../01-infra/authenticator'
import { UploadPresenter } from './presenter'
import { UploadQueuer } from './queuer'
import { UploadStorer } from './storer'
import { UploadValidator } from './validator'

export class UploadController {
  static async run({ req, get, json }: Context): Promise<Response> {
    const body = await req.formData().catch(Error)
    const customerID = Authenticator.getCustomerID(get)

    return new UploadUsecase(
      new UploadValidator(body),
      new UploadPresenter(json),
      new UploadStorer('tmp'),
      new UploadQueuer()
    ).execute(customerID)
  }
}
