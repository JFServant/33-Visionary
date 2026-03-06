import type { IUploadPresenter } from './presenter/contract'
import type { IUploadQueuer } from './queuer/contract'
import type { IUploadStorer } from './storer/contract'
import type { IUploadValidator } from './validator/contract'

export class UploadUsecase {
  constructor(
    private readonly validator: IUploadValidator,
    private readonly presenter: IUploadPresenter,
    private readonly storer: IUploadStorer,
    private readonly queuer: IUploadQueuer
  ) {}

  async execute(customerID: string): Promise<Response> {
    const validation = this.validator.parse()

    if ('error' in validation) {
      return this.presenter.validationFail(validation)
    }

    const { tmpPath, internalName } = await this.storer.saveToDisk({
      image: validation.data,
      customerID,
    })

    const { name } = validation.data

    await this.queuer.detection({
      tmpPath,
      originalName: name,
      internalName,
      customerID,
    })

    return this.presenter.success({ data: true })
  }
}
