const { request } = require('express')
const Tour = require('../models/tourModel')
const APIFeatures = require('../utils/apiFeatures')

exports.aliasTopCheapTours = (req, res, next) => {
	req.query.sort = 'price,-ratingsAverage'
	req.query.limit = '5'
	req.query.fields = 'name,ratingsAverage,duration,price,difficulty'
	next()
}

exports.getAllTours = async (req, res) => {
	try {
		const features = new APIFeatures(Tour, req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate()
		const tours = await features.databaseQuery

		res.json({
			status: 'success',
			data: {
				results: tours.length,
				tours
			}
		})
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err.message
		})
	}
}

exports.createNewTour = async (req, res) => {
	try {
		const newTour = await Tour.create(req.body)
		res.status(201).json({
			status: 'success',
			data: {
				tour: newTour
			}
		})
	} catch (err) {
		res.status(400).json({
			status: 'fail',
			message: err.message
		})
	}
}

exports.getTour = async (req, res) => {
	try {
		const tour = await Tour.findById(req.params.id)
		res.json({
			status: 'success',
			data: {
				tour
			}
		})
	} catch (err) {
		res.status(404).json({
			status: 'fail',
			message: err.message
		})
	}
}

exports.updateTour = async (req, res) => {
	try {
		const updatedTour = await Tour.findByIdAndUpdate(
			req.params.id,
			req.body,
			{ new: true, runValidators: true }
		)
		res.json({
			status: 'success',
			data: {
				tour: updatedTour
			}
		})
	} catch (err) {
		res.status(404).json({
			status: 'error',
			message: err.message
		})
	}
}

exports.deleteTour = async (req, res) => {
	try {
		await Tour.findByIdAndDelete(req.params.id)
		res.status(204).json({
			status: 'success',
			data: null
		})
	} catch (err) {
		res.status(404).json({
			status: 'error',
			message: err.message
		})
	}
}

exports.getTourStats = async (req, res) => {
	try {
		const stats = await Tour.aggregate([
			{
				$match: { ratingsAverage: { $gte: 4.5 } }
			},
			{
				$group: {
					_id: { $toUpper: '$difficulty' },
					numOfDocuments: { $sum: 1 },
					numOfRatings: { $sum: '$ratingsQuantity' },
					avgRating: { $avg: '$ratingsAverage' },
					avgPrice: { $avg: '$price' },
					minPrice: { $min: '$price' },
					maxPrice: { $max: '$price' }
				}
			},
			{
				$sort: { avgPrice: 1 }
			}
		])

		res.json({
			stats: 'success',
			data: {
				stats
			}
		})
	} catch (err) {
		res.status(404).json({
			status: 'error',
			message: err.message
		})
	}
}

exports.getMonthlySchedule = async (req, res) => {
	try {
		const year = Number(req.params.year)
		const schedule = await Tour.aggregate([
			{
				$unwind: '$startDates'
			},
			{
				$match: {
					startDates: {
						$gte: new Date(`${year}-01-01`),
						$lte: new Date(`${year}-12-31`)
					}
				}
			},
			{
				$group: {
					_id: { $month: '$startDates' },
					numOfTours: { $sum: 1 },
					tours: { $push: '$name' }
				}
			},
			{
				$addFields: { month: '$_id' }
			},
			{
				$project: { _id: 0 }
			},
			{
				$sort: { numOfTours: -1, month: 1 }
			}
		])

		res.json({
			stats: 'success',
			data: {
				schedule
			}
		})
	} catch (err) {
		res.status(404).json({
			status: 'error',
			message: err.message
		})
	}
}
