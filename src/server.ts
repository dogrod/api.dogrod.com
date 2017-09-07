import * as dotenv from 'dotenv'
import * as express from 'express'
import * as path from 'path'
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' })

/**
 * Controllers (route handlers).
 */
import * as homeController from './controllers/home'
import * as userController from './controllers/user'

/**
 * Create Express server.
 */
const app = express()

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(process.cwd(), 'views'))
app.set('view engine', 'pug')

/**
 * Primary app routes.
 */
app.get('/', homeController.index)
app.get('/login', userController.getLogin)
app.get('/signup', userController.getSignUp)

app.listen(app.get('port'))