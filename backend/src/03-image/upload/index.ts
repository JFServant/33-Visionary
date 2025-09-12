import type { IUploadPresenter } from './presenter'
import type { IUploadQueuer } from './queuer'
import type { IUploadStorer } from './storer'
import type { IUploadValidator } from './validator'

export class UploadUsecase {
  constructor(
    private readonly validator: IUploadValidator,
    private readonly presenter: IUploadPresenter,
    private readonly storer: IUploadStorer,
    private readonly queuer: IUploadQueuer
  ) {}

  async execute(customerID: string): Promise<Response> {
    const validation = this.validator.parse()

    if (!validation.success) {
      return this.presenter.validationFail({ error: validation.error })
    }

    const { tmpPath, internalName } = await this.storer.saveToDisk({
      image: validation.image,
      customerID,
    })

    const { name } = validation.image

    await this.queuer.detection({
      tmpPath,
      originalName: name,
      internalName,
      customerID,
    })

    return this.presenter.success({ data: true })
  }
}
