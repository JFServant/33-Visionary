import { Hono } from 'hono'
import { Authenticator } from '../00-global/authenticator'
import { UploadController } from './upload/controller'

export const imageRouter = new Hono()

imageRouter.use('*', Authenticator.guard)
imageRouter.post('/upload', UploadController.run)
