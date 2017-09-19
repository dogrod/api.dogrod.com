import { Request, Response } from 'express'
import Article from '../models/Article'
import loggerProto from '../utils/log'

const logger = loggerProto('blog')

export let getPosts = async (request: Request, response: Response) => {
  try {
    const posts = await Article.find().exec()

    const res: IResponse = {
      code: 'SUCCESS',
      description: null,
      result: {
        posts,
      }
    }

    return response.json(res)
  } catch (error) {
    logger.error(`An error occurred when get posts list: ${JSON.stringify(error)}`)
    const res: IResponse = {
      code: 'FAILED',
      description: 'Internal error.',
      result: null,
    }

    return response.json(res)
  }
}
/**
 * publish article API
 */
export let putPublishArticle = async (request: Request, response: Response) => {
  const requestBody: IBlog.BlogCreationRequest = request.body

  const session = request.session
  const instanceParam = { 
    ...requestBody, 
    author: session ? session.username : null,
    isPublished: true,
  }

  const article = new Article(instanceParam)

  try {
    const value = await article.save()

    const res: IResponse = {
      code: 'SUCCESS',
      description: null,
      result: {
        ...instanceParam,
        id: value._id,
      }
    }
    return response.json(res)
  } catch (error) {
    logger.error(`An error occurred when save blog article: ${JSON.stringify(error)}`)
    const res: IResponse = {
      code: 'FAILED',
      description: 'Internal error.',
      result: null,
    }

    return response.json(res)
  }
}