import { Router } from 'express'

import { createApiRoute } from '../utils'
import Group from './Group'
import User from './User'

const routes = Router()

routes.use(createApiRoute('/groups'), Group)
routes.use(createApiRoute('/users'), User)

export default routes
