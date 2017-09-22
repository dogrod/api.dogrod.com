import * as express from 'express'
import loggerProto from '../utils/log'

const logger = loggerProto('delete-session')

/**
 * package express-session destroy method return a Promise
 */
export let deleteSession = async (session: Express.Session) => {
  session.destroy((err) => {
    if (err) {
      logger.error(`An error occurred when destroy session: ${JSON.stringify(err)}`)
      return Promise.reject(err)
    }
    return session
  })
}