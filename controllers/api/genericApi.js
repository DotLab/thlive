module.exports = function (model) {
	return function (req, res, next) {
		var q;

		if (req.query.id) {  // Single document
			q = model.findById(req.query.id);
		} else {  // Multiple documents
			q = model.find(req.query.query);

			if (req.query.skip)
				q.skip(parseInt(req.query.skip));

			if (req.query.limit)
				q.limit(parseInt(req.query.limit));

			if (req.query.sort)
				q.sort(req.query.sort);
		}

		if (req.query.populate)
			q.populate(req.query.populate);

		q.then(data => {
			res.send(data)
		}).catch(err => next(err));
	};
};

exports.findById = function (model) {
	return function (req, res, next) {
		var q = model.findById(req.params.id);

		if (req.query.populate)
			q.populate(req.query.populate);

		q.then(doc => {
			res.send(doc)
		}).catch(err => next(err));
	};
};