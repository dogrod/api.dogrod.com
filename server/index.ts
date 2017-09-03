import * as dotenv from 'dotenv'
import * as express from 'express'

/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' })

/**
 * Create Express server.
 */
const app = express()

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000)

/**
 * Primary app routes.
 */
app.get('/', (req: express.Request, res: express.Response) => {
  res.send('hello express')
})

app.listen(app.get('port'))