import { Router } from 'express'

import { createApiRoute } from '../utils'
import User from './User'

const routes = Router()

routes.use(createApiRoute('/users'), User)

export default routes
