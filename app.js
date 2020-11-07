const express = require('express')
const morgan = require('morgan')
const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

const app = express()

if (process.env.NODE_ENV === 'development') {
	app.use(morgan('dev'))
}

app.use(express.json())
app.use(express.static(`${__dirname}/public`))

const apiUrl = '/api/v1'
app.use(`${apiUrl}/tours`, tourRouter)
app.use(`${apiUrl}/users`, userRouter)

module.exports = app
