import { Hono } from 'hono'
import { Authenticator } from '../01-infra/authenticator'
import { ListingController } from './listing/controller'
import { UploadController } from './upload/controller'

export const imageRouter = new Hono()

imageRouter.use('*', Authenticator.guard)
imageRouter.post('/upload', UploadController.run)
imageRouter.get('/listing', ListingController.run)
