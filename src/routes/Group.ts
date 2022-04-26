import { Router } from 'express'

import Group from '../controllers/GroupController'

const routes = Router()

routes.get('/', Group.show)

export default routes
