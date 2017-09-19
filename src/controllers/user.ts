import { Request, Response } from 'express'
import User from '../models/User'
import loggerProto from '../utils/log'

const logger = loggerProto('user')

/**
 * login page
 */
export let getLogin = (req: Request, res: Response) => {
  res.render('account/login', {
    title: 'log in'
  })
}
/**
 * sign up page
 */
export let getSignUp = (req: Request, res: Response) => {
  res.render('account/signup', {
    title: 'sign up'
  })
}

/**
 * sign up API
 */
export let postSignUp = async (request: Request, response: Response) => {
  // res.send(JSON.stringify(req.path))
  logger.debug(JSON.stringify(request.body))
  const requestBody: IUser.UserSignupRequest = request.body

  const username = requestBody.username
  const password = requestBody.password
  const email = requestBody.email

  if (
    !username ||
    !password
  ) {
    const res: IResponse = {
      code: 'DNE_FIELD', // DNE = abbreviation of Does Not Exist
      description: 'Username / password does not exist.',
      result: null,
    }
    return response.json(res)
  }
  const session = request.session

  try {
    // verify if username exist
    const existingUserWithUserName = await User.find({ username }).exec()
  
    if (existingUserWithUserName.length) {
      const error: IResponse = {
        code: 'EXIST_USER',
        description: 'Account with this username already exists.',
        result: null,
      }
      throw new Error(JSON.stringify(error))
    }
    
    // verify if email exist
    const existingUserWithEmail = await User.find({ email }).exec()

    if (existingUserWithEmail.length) {
      const error: IResponse = {
        code: 'EXIST_EMAIL',
        description: 'Account with this email already exists.',
        result: null,
      }
      throw new Error(JSON.stringify(error))
    }
    const user = new User(requestBody)
    
    await user.save()

    // mark username & email via session
    if (session) {
      session.username = username
      session.email = email
    }

    const res: IResponse = {
      code: 'SUCCESS',
      description: null,
      result: {
        username,
        email,
      },
    }
    return response.json(res)
  } catch (error) {
    if (session) {
      // async operation
      session.destroy((err) => {
        if (err) {
          logger.error(`An error occurred when destroy session: ${JSON.stringify(err)}`)
        }
      })
    }
    // error handler
    let res = JSON.parse(error.message)
    // if res does not have 'code' property, it's a internal error
    if (!res.code) {
      res = {
        code: 'FAILED',
        description: 'Internal error.',
        result: null,
      }
    }
    return response.json(res)
  }
}

export let getUserList = async (request: Request, response: Response) => {
  try {
    const existingUser = await User.find({}).exec()

    const res: IResponse = {
      code: 'SUCCESS',
      description: null,
      result: {
        list: existingUser,
      },
    }

    return response.json(res)
  } catch (error) {
    logger.error(`An error occurred when get user list: ${JSON.stringify(error)}`)
    const res: IResponse = {
      code: 'FAILED',
      description: 'Internal error.',
      result: null,
    }

    return response.json(res)
  }
}