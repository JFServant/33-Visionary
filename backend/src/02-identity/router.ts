import { Hono } from 'hono'
import { LoginController } from './login/controller'
import { SignupController } from './signup/controller'

export const identityRouter = new Hono()

identityRouter.post('/signup', SignupController.run)
identityRouter.post('/login', LoginController.run)
