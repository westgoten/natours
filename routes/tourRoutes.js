const express = require('express')
const tourController = require('../controllers/tourController')

const router = express.Router()

router
	.route('/')
	.get(tourController.getAllTours)
	.post(tourController.createNewTour)

router
	.route('/top-5-cheap')
	.get(tourController.aliasTopCheapTours, tourController.getAllTours)

router.route('/tour-stats').get(tourController.getTourStats)

router.route('/monthly-schedule/:year').get(tourController.getMonthlySchedule)

router
	.route('/:id')
	.get(tourController.getTour)
	.patch(tourController.updateTour)
	.delete(tourController.deleteTour)

module.exports = router
