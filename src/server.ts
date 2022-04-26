import Express from 'express'

import routes from './routes'

const app = Express()

app.use(Express.json())
app.use(routes)

app.listen(process.env.PORT)
