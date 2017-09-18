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
  const reqBody: IUser.UserSignupRequest = request.body

  const username = reqBody.username
  const password = reqBody.password

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
  
  // mark username via session
  const session = request.session

  try {
    const existingUser = await User.find({ username }).exec()
  
    if (existingUser.length) {
      const error: IResponse = {
        code: 'EXIST_USER',
        description: 'Username exist.',
        result: null,
      }
      throw new Error(JSON.stringify(error))
    }
  
    const user = new User(reqBody)
    
    await user.save()

    if (session) {
      session.username = reqBody.username
      session.email = reqBody.email
    }

    const res: IResponse = {
      code: 'SUCCESS',
      description: null,
      result: {
        username,
        email: reqBody.email,
      },
    }
    return response.json(res)
  } catch (error) {
    let res = JSON.parse(error.message)
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