require('dotenv').config({ path: './config.env' })
const fs = require('fs')
const mongoose = require('mongoose')
const Tour = require('../../models/tourModel')

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
	.then(() => {
		if (process.argv[2] === '--import') importData()
		else if (process.argv[2] === '--delete') deleteData()
	})
	.catch((err) => console.error(err))

async function importData() {
	const tours = JSON.parse(
		fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
	)
	try {
		await Tour.create(tours)
		await mongoose.disconnect()
		console.log('Imported data to database successfully!')
	} catch (err) {
		console.error(err)
		process.exit()
	}
}

async function deleteData() {
	try {
		await Tour.deleteMany()
		await mongoose.disconnect()
		console.log('Deleted data from database successfully!')
	} catch (err) {
		console.error(err)
		process.exit()
	}
}
