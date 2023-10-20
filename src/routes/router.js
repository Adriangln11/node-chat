import { Router } from 'express'
import passport from 'passport'

const router = Router()

router
  .get(
    '/',
    (req, res, next) => {
      if (req.isAuthenticated()) {
        return next()
      }
      return res.render('signup', { title: 'Chat | SignUp' })
    },
    (req, res) => {
      return res.render('index', { title: 'Chat | Online' })
    }
  )
  .get('/signup', (req, res) => {
    return res.render('signup', { title: 'Chat | SignUp' })
  })
  .get('/login', (req, res) => {
    return res.render('login', { title: 'Chat | Login' })
  })
  .post(
    '/signup',
    passport.authenticate('signup', {
      failureRedirect: '/signup',
      successRedirect: '/',
      failureFlash: true,
    })
  )
  .post(
    '/login',
    passport.authenticate('login', {
      failureRedirect: '/login',
      successRedirect: '/',
      failureFlash: true,
    })
  )
  .get('/logout', (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err)
      res.redirect('/')
    })
  })
  .get('/api/hello', (req, res) => {
    return res.json({ greeting: 'Hello API' })
  })

export default router
