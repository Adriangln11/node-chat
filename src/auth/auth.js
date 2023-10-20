import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import UserModel from '../models/user.js'
import bcrypt from 'bcrypt'

passport.serializeUser(function (user, done) {
  return done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  const userDoc = await UserModel.findById(id)
  return done(null, userDoc)
})

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      console.log(req.socket)
      try {
        const userExist = await UserModel.findOne({ email: username })
        if (userExist)
          return done(
            null,
            false,
            req.flash('signUpMessage', 'The Email already Exist.')
          )

        const hash = await bcrypt.hash(password, 10)
        const user = await UserModel.create({ email: username, password: hash })
        return done(null, user)
      } catch (e) {
        console.log(e)
        return done(e)
      }
    }
  )
)

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      console.log(req.socket)

      try {
        const userDoc = await UserModel.findOne({ email: username })
        if (!userDoc)
          return done(null, false, req.flash('logInMessage', 'User not found'))

        const passCorrect = await bcrypt.compare(password, userDoc.password)

        if (!passCorrect)
          return done(
            null,
            false,
            req.flash('logInMessage', 'Password mismatch')
          )

        return done(null, userDoc, req.flash('logInMessage', 'Login success'))
      } catch (e) {
        console.log(e)
        return done(e)
      }
    }
  )
)
