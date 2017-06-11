var path = require('path');
global.appRoot = path.resolve(__dirname);

var marked = require('marked');

var express = require('express');
var favicon = require('serve-favicon');

var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var validator = require('express-validator');
var fileupload = require('express-fileupload');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var artists = require('./routes/artists');
var images = require('./routes/images');
var characters = require('./routes/characters');
var cards = require('./routes/cards');
var api = require('./routes/api');

marked.setOptions({
	highlight: function (code) {
		return require('highlight.js').highlightAuto(code).value;
	},
	langPrefix:'hljs '
});

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/thlive');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middlewares
app.use(morgan('dev'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(session({
	resave: false, // don't save session if unmodified
	saveUninitialized: false, // don't create session until something stored
	secret: '此生无悔入东方，来世愿生幻想乡。',
	store: new MongoStore({ mongooseConnection: db })
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator({
errorFormatter: function(param, msg, value) {
	var namespace = param.split('.'), root = namespace.shift(), formParam = root;

	while(namespace.length) {
		formParam += '[' + namespace.shift() + ']';
	}

	return {
		name: formParam,
		message: msg + ' "' + value + '"',
	};
}
}));
app.use(fileupload());
// app.use(cookieParser());

// routes
app.use('/', index);

app.use('/api', api);

app.use('/users', users);
app.use('/artists', artists);
app.use('/images', images);
app.use('/characters', characters);
app.use('/cards', cards);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	// res.locals.message = err.message;
	// res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error', { title: err.name, error: err });
});

module.exports = app;
