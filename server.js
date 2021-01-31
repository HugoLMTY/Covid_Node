const express = require('express')
const app = express()
const expressLayout = require('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')
const authorsRouter = require('./routes/authors')
const vaccinesRouter = require('./routes/vaccination')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layout/layout')
app.use(expressLayout)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/420Node', {
    useNewUrlParser: true  })

const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log("mongoose ok"))

app.use('/', indexRouter)
app.use('/authors', authorsRouter)
app.use('/vaccination', vaccinesRouter)

app.listen(process.env.PORT || 3000)