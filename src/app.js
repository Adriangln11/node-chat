import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import passport from 'passport'
import flash from 'connect-flash'
import session from 'express-session'
import morgan from 'morgan'
import router from './routes/router.js'
import 'dotenv/config'
import './db/db.js'
import './auth/auth.js'

const app = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.disable('x-powered-by')

app.set('view engine', 'ejs')
app.set('views', join(__dirname, 'views'))
app.set('port', process.env.PORT || 3000)
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static(join(__dirname, 'public')))

app.use(
  session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

app.use((req, res, next) => {
  app.locals.signUpMessage = req.flash('signUpMessage')
  app.locals.logInMessage = req.flash('logInMessage')
  app.locals.user = req.user
  next()
})

app.use(router)

export default app
