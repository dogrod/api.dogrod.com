import { Request, Response } from 'express'

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