const express = require('express')
const session = require('express-session')
const app = express()
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const passport = require('passport')
const cookieParser = require('cookie-parser')

const initializePassport = require('./passport-config')

const indexRouter = require('./routes/index')
const authorsRouter = require('./routes/authors')
const vaccinesRouter = require('./routes/vaccines')
const usersRouter = require('./routes/users')
const regionRouter = require('./routes/regions')


app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layout/layout')
app.use(expressLayout)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(cookieParser())
app.use(session({
    secret: 'key',
    resave: false,
    saveUninitialized: false
}))


mongoose.connect('mongodb://localhost/420Node', {
    useNewUrlParser: true  })

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("Mongoose connecté"))

app.use('/', indexRouter)
app.use('/authors', authorsRouter)
app.use('/vaccines', vaccinesRouter)
app.use('/users', usersRouter)
app.use('/regions', regionRouter)
app.use(express.static(__dirname + '/ressources'))

app.listen(process.env.PORT || 3000)