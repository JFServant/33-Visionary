import { Hono } from 'hono'
import { Authenticator } from '../01-infra/authenticator.js'
import { CocoSSDController } from './cocossd/controller.js'

export const detectionRouter = new Hono()

detectionRouter.use('*', Authenticator.guard)
detectionRouter.post('/cocossd', CocoSSDController.run)
