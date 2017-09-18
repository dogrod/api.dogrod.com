import * as express from 'express'

/**
 * set default content-type with json for api routes 
 */
const setDefaultResponseHeader: express.RequestHandler = (
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) => {
  if (request.path.toLowerCase().indexOf('/api/') > -1) {
    response.setHeader('Content-Type', 'application/json')
  }
  next()
}

export default setDefaultResponseHeader