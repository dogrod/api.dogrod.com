import { Request, Response } from 'express'
import User from '../models/User'
import loggerProto from '../utils/log'
import validateEmail from '../utils/validate-email'

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
 * log in API
 */
export let postLogin = async (request: Request, response: Response) => {
  const requestBody: IUser.LoginRequest = request.body
  
  const loginVoucher = requestBody.username
  const password = requestBody.password

  if (
    !loginVoucher ||
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

  const query: {
    email?: string,
    username?: string,
  } = {}

  if (validateEmail(loginVoucher)) {
    query.email = loginVoucher
  } else {
    query.username = loginVoucher
  }
  try {
    const user = await User.findOne(query)
  
    if (!user) {
      const error: IResponse = {
        code: 'DNE_USER',
        description: 'Username / email does not exist.',
        result: null,
      }
      throw new Error(JSON.stringify(error))
    }

    const isPasswordRight = user.validPassword(password)

    if (!isPasswordRight) {
      const error: IResponse = {
        code: 'INCORRECT_PASSWORD',
        description: 'Incorrect password.',
        result: null,
      }
      throw new Error(JSON.stringify(error))
    }

    // mark username & email via session
    // if session property exists, cannot assign new field to that property because that property is read only
    if (
      session
      && session.id
    ) {
      session.destroy((err) => {
        if (err) {
          logger.error(`An error occurred when destroy session: ${JSON.stringify(err)}`)
        }
        session.id = user._id
      })
    } else if (session) {
      session.id = user._id
    }
    
    const res: IResponse = {
      code: 'SUCCESS',
      description: null,
      result: null,
    }
    return response.json(res)
  } catch (error) {
    logger.error(`An error occurred when log in: ${JSON.stringify(error)}`)
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

/**
 * sign up API
 */
export let postSignUp = async (request: Request, response: Response) => {
  // res.send(JSON.stringify(req.path))
  logger.debug(JSON.stringify(request.body))
  const requestBody: IUser.SignupRequest = request.body

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
    // email is unique in DB
    // email can be blank
    if (email) {
      const existingUserWithEmail = await User.find({ email }).exec()
  
      if (existingUserWithEmail.length) {
        const error: IResponse = {
          code: 'EXIST_EMAIL',
          description: 'Account with this email already exists.',
          result: null,
        }
        throw new Error(JSON.stringify(error))
      }
    }
    const user = new User(requestBody)

    // generate hash of password
    if (requestBody.password) {
      const passwordHash = user.generateHash(requestBody.password)
      user.password = passwordHash
    }

    const newUser = await user.save()

    // mark username & email via session
    // if session property exists, cannot assign new field to that property because that property is read only
    if (
      session
      && session.id
    ) {
      session.destroy((err) => {
        if (err) {
          logger.error(`An error occurred when destroy session: ${JSON.stringify(err)}`)
          session.id = newUser._id
        }
      })
    } else if (session) {
      session.id = newUser._id
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
    logger.debug(`Save to DB failed: ${error}`)
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