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

    const { internalName, tmpPath } = await this.storer.saveToDisk(validation.image)

    const { name, size, type } = validation.image

    await this.queuer.detection({
      originalName: name,
      internalName,
      tmpPath,
      size,
      mimeType: type,
      requesterID: customerID,
    })

    return this.presenter.success({ data: true })
  }
}
