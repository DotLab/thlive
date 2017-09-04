exports.model = {
	common: {
		taggableSchemas: [ 'Image', 'Card' ],
		votableSchemas: [ 'Edit', 'Tag', 'Designation', 'Image', 'Card' ],
	},

	edit: {
		action: [ 'create', 'edit', 'rollback' ],
		status: [ 'pending', 'approved', 'rejected' ],
	},
};