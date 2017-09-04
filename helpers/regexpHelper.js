exports.model = {
	user: {
		// 1 to 20 character of English, Chinese, or Japanese
		name: /^[0-9a-zA-Z\u3040-\u309f\u30a0-\u30ff\u4E00-\u9FFF\uF900-\uFAFF ]{1,20}$/,
		email: /^[0-9a-zA-Z.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
	},
	tag: {
		// 1 to 20 character of English, Chinese, or Japanese with . - + #
		slaves: /^[0-9a-z\u3040-\u309f\u30a0-\u30ff\u4E00-\u9FFF\uF900-\uFAFF \.\-\+\#]{1,20}$/,
	},
};