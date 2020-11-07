class APIFeatures {
	constructor(model, requestQuery) {
		this.databaseQuery = model.find()
		this.requestQuery = requestQuery
	}

	filter() {
		const filter = { ...this.requestQuery }
		const excludedProperties = ['sort', 'page', 'limit', 'fields']
		excludedProperties.forEach((property) => delete filter[property])

		let queryString = JSON.stringify(filter)
		queryString = queryString.replace(
			/\b(gt|gte|lt|lte)\b/g,
			(match) => '$' + match
		)
		this.databaseQuery.find(JSON.parse(queryString))
		return this
	}

	sort() {
		if (this.requestQuery.sort) {
			const sortBy = this.requestQuery.sort.split(',').join(' ')
			this.databaseQuery.sort(sortBy)
		} else {
			this.databaseQuery.sort('-createdAt')
		}
		return this
	}

	limitFields() {
		if (this.requestQuery.fields) {
			const fields = this.requestQuery.fields.split(',').join(' ')
			this.databaseQuery.select(fields)
		} else {
			this.databaseQuery.select('-__v')
		}
		return this
	}

	paginate() {
		const page = this.requestQuery.page ? Number(this.requestQuery.page) : 1
		const limit = this.requestQuery.limit
			? Number(this.requestQuery.limit)
			: 100
		const skip = (page - 1) * limit
		this.databaseQuery.skip(skip).limit(limit)
		return this
	}
}

module.exports = APIFeatures
