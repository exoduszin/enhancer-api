import { Router } from 'express'

import User from '../controllers/UserController'

const routes = Router()

routes.get('/', User.show)

export default routes
