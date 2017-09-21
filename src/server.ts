import * as bodyParser from 'body-parser'
import * as connectMongo from 'connect-mongo'
import * as dotenv from 'dotenv'
import * as express from 'express'
import * as flash from 'express-flash'
import * as session from 'express-session'
import * as mongoose from 'mongoose'
import * as logger from 'morgan'
import * as path from 'path'

const MongoStore = connectMongo(session)
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.config({ path: '.env' })

/**
 * Controllers (route handlers).
 */
import * as blogController from './controllers/blog'
import * as homeController from './controllers/home'
import * as userController from './controllers/user'

/**
 * Create Express server.
 */
const app = express()

mongoose.connect(process.env.MONGODB_URI || process.env.MONGOLAB_URI)
mongoose.connection.on('error', () => {
  // console.log("MongoDB connection error. Please make sure MongoDB is running.")
  process.exit()
})
/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(process.cwd(), 'views'))
app.set('view engine', 'pug')
app.use(logger('short'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: process.env.SESSION_SECRET,
  store: new MongoStore({
    autoReconnect: true,
    url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
  })
}))

/**
 * Primary app routes.
 */
app.get('/', homeController.index)
app.get('/login', userController.getLogin)
app.get('/signup', userController.getSignUp)
/**
 * API routes
 */
// user
app.get('/api/users', userController.getUserList)
app.post('/api/user/login', userController.postLogin)
app.post('/api/user/signup', userController.postSignUp)

// blog
app.get('/api/blog/posts', blogController.getPosts)
app.put('/api/blog/creation', blogController.putPublishArticle)

app.listen(app.get('port'))