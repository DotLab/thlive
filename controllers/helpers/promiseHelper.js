exports.mapAll = function (promiseMap) {
	return Promise.all(Object.values(promiseMap)).then(results => {
		var resultMap = {};
		Object.keys(promiseMap).forEach(function (key, i) {
			resultMap[key] = results[i];
		});
		return resultMap;
	});
};