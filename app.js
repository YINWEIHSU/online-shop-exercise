if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const exphbs = require('express-handlebars')
const session = require('express-session')
const methodOverride = require('method-override')
const usePassport = require('./config/passport')
const flash = require('connect-flash')


const indexRouter = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
// view engine setup
app.engine('.hbs', exphbs({
  extname: '.hbs',
  defaultLayout: 'client',
  helpers: require('./config/handlebars-helpers')
}));

app.use(logger('dev'));
app.use(express.json());
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', express.static(__dirname + '/upload'))

app.use(cookieParser());
app.use(session({
  secret: process.env.SECRET,
  name: 'online-shop',
  cookie: { maxAge: 600000 },
  resave: false,
  saveUninitialized: true,
}));

usePassport(app)
app.use(flash())
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated()
  res.locals.user = req.user
  res.locals.success_msg = req.flash('success_message')
  res.locals.error_msg = req.flash('error_message')
  next()
})

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(PORT, () => console.log(`app is running on http://localhost:${PORT}`))
module.exports = app;
