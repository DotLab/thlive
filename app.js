var debug = require('debug')('thlive:app');

// env ----------------------------------------------------------------------------------------------------
global.isProduction = (process.env.NODE_ENV == 'production');
global.isDevelopment = !isProduction;
debug('isProduction:', isProduction);

var path = require('path');
global.appRoot = path.resolve(__dirname);
debug('appRoot', appRoot);

// marked ----------------------------------------------------------------------------------------------------
var marked = require('marked');
var hljs = require('highlight.js');
marked.setOptions({
	highlight: code => hljs.highlightAuto(code).value,
	langPrefix:'hljs '
});

// moment ----------------------------------------------------------------------------------------------------
var moment = require('moment');
moment.locale();

// mongoose ----------------------------------------------------------------------------------------------------
var mongoose = require('mongoose').set('debug', true);
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/thlive', {
	useMongoClient: true,
}).then(db => {
	db.on('error', console.error.bind(console, 'MongoDB connection error:'));
});

// express ----------------------------------------------------------------------------------------------------
var express = require('express');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
if (isProduction) {
	app.set('trust proxy', 1);
	app.set('view cache', true);
}

// morgan ----------------------------------------------------------------------------------------------------
var morgan = require('morgan');
app.use(morgan('dev')); // log requests

// static ----------------------------------------------------------------------------------------------------
if (isDevelopment)  // use nginx to serve static files in production
	app.use(express.static(path.join(__dirname, 'public')));

// fileupload ----------------------------------------------------------------------------------------------------
var fileupload = require('express-fileupload');
app.use(fileupload());

// session ----------------------------------------------------------------------------------------------------
var crypto = require('crypto');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
app.use(session({
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret: isDevelopment ? '此生无悔入东方，来世愿生幻想乡。' : crypto.randomBytes(128).toString('base64'),
	store: new MongoStore({ mongooseConnection: mongoose.connection }),
	cookie: {
		secure: isProduction
	}
}));

// bodyParser ----------------------------------------------------------------------------------------------------
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// validator ----------------------------------------------------------------------------------------------------
var validator = require('express-validator');
app.use(validator({
	customValidators: {
		isArray: function(value) {
			return Array.isArray(value);
		}
	},
	errorFormatter: (param, msg, value) => {
		return { 
			name: 'ExpressValidationError', 
			message: `Path \`${param}\` validation failed: \`${value}\` is ${msg}` }
	}
}));

// locals ----------------------------------------------------------------------------------------------------
var numeral = require('numeral');

app.use(function (req, res, next) {
	req.bindf = {};

	res.locals.format = {
		toPascalCase: function (str) {
			return str.replace(/(\w)(\w*)/g, function (g0, g1, g2) {
				return g1.toUpperCase() + g2.toLowerCase();
			});
		},

		numeral: function (n) {
			if (n <= 10000) return numeral(n).format('0,0');	
			else if (n <= 100000) return numeral(n).format('0.0a');	
			else return numeral(n).format('0a');
		},

		dateFromNow: function (date) {
			return moment(date).fromNow();
		},

		date: function (date) {
			return moment(date).format('MMM D \'YY');
		},

		datetime: function (date) {
			return moment(date).format('MMM D [\']YY [at] k:m');
		},

		minimark: function (mark) {
			mark = mark.replace(/\[([^\[]+)\]\(([^\)]+)\)/g, '<a href="$2">$1</a>');
			mark = mark.replace(/(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/g, match => `<a href="${match}">${decodeURI(match)}</a>`);
			mark = mark.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');
			mark = mark.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');
			mark = mark.replace(/\~\~(.*?)\~\~/g, '<del>$1</del>');
			mark = mark.replace(/`(.*?)`/g, '<code>$1</code>');
			return mark;
		}
	};

	res.locals.mortal = req.session.user;

	res.locals.originalUrl = req.originalUrl;
	res.locals.baseUrl = req.baseUrl;
	res.locals.path = req.path;

	res.locals.body = req.body;
	res.locals.query = req.query;

	res.locals.marked = marked;
	res.locals.moment = moment;
	res.locals.numeral = numeral;

	res.locals.jsdiff = require('diff');
	res.locals.sanitizeHtml = require('sanitize-html');

	next();
});

// routes ----------------------------------------------------------------------------------------------------
var router = require('./routes/router');
app.use('/', router);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	var err = new Error('Page Not Found');
	err.status = 404;

	next(err);
});

// error handler
app.use(function (err, req, res, next) {
	res.status(err.status || 500);

	res.render('error', { 
		title: err.name, 
		error: isDevelopment ? err : { name: err.name, message: err.message }
	});
});

module.exports = app;