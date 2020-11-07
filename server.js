require('dotenv').config({ path: './config.env' })
const mongoose = require('mongoose')
const app = require('./app')

const DB_URI = process.env.DATABASE_URI.replace(
	'<PASSWORD>',
	process.env.PASSWORD
)
mongoose
	.connect(DB_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	})
	.then(() =>
		app.listen(process.env.PORT, process.env.HOST, () => {
			console.log(`Listening to requests on port ${process.env.PORT}`)
		})
	)
	.catch((err) => console.error(err.message))
