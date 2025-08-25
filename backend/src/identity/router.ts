import { Hono } from 'hono'
import { SignupController } from './signup/controller'

export const identityRouter = new Hono()

identityRouter.post('/signup', SignupController.run)
