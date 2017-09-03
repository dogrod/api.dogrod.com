import * as express from 'express'

const app = express()

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello express')
})

app.listen(3000)