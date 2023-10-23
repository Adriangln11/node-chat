import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import UserModel from '../models/user.js'

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
      try {
        const userExist = await UserModel.findOne({ email: username })
        if (userExist)
          return done(
            null,
            false,
            req.flash('signUpMessage', 'The Email already Exist.')
          )

        const hash = await bcrypt.hash(password, 10)
        const user = await UserModel.create({
          email: username,
          password: hash,
        })
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

        return done(null, userDoc)
      } catch (e) {
        console.log(e)
        return done(e)
      }
    }
  )
)
