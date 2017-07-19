exports.find = function (model) {
	return function (req, res, next) {
		var q = model.find(req.query.query);

		if (req.query.skip)
			q.skip(parseInt(req.query.skip));

		if (req.query.limit)
			q.limit(parseInt(req.query.limit));

		if (req.query.sort)
			q.sort(req.query.sort);

		if (req.query.populate)
			q.populate(req.query.populate);

		q.then(docs => {
			res.send(docs)
		}).catch(err => next(err));
	};
};

exports.findById = function (model) {
	return function (req, res, next) {
		model.findById(req.params.id).then(doc => {
			res.send(doc)
		}).catch(err => next(err));
	};
};