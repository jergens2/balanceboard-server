const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressJwt = require('express-jwt');
const fs = require("fs");

const authenticationRoutes = require('./routes/authenticationRoutes');
const userAccountRoutes = require('./routes/userAccountProfileRoutes');
const activityCategoryDefinitionRoutes = require('./routes/activityCategoryDefinitionRoutes');
const scheduleDayTemplateRoutes = require('./routes/scheduleDayTemplate');
const scheduleRotationRoutes = require('./routes/scheduleRotation');
const taskRoutes = require('./routes/task');
const notebookRoutes = require('./routes/notebookEntry');
const serverScriptsRoutes = require('./routes/serverScripts');
const routineDefinitionRoutes = require('./routes/routineDefinition');
const dailyTaskListRoutes = require('./routes/dailyTaskList');
const socialRoutes = require('./routes/socialRoutes');
const daybookDayItemRoutes = require('./routes/daybookDayItemRoutes');
const sleepManagementRoutes = require('./routes/sleepManagementRoutes');


const config = require('./config.json');
const dbUser = config.database.user;
const dbPass = config.database.password;
const dbHost = config.database.host;
const mongoDB = 'mongodb://'+dbUser+':'+dbPass+'@'+dbHost;
mongoose.connect(mongoDB);
// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;
//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon('favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.resolve(public + '/index.html'))
})

// app.get('*', function(req, res){
//   res.send('what???', 404);
// });

app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, observe');
  res.setHeader('Access-Control-Allow-Methods', "POST, GET, PATCH, DELETE, OPTIONS");
  next();
});




app.use('/api/authentication', authenticationRoutes);

const RSA_PUBLIC_KEY = fs.readFileSync('./key/public_key.key');
const checkIfAuthenticated = expressJwt({
  secret: RSA_PUBLIC_KEY,
});


app.use('/api/user-account-profile', checkIfAuthenticated, userAccountRoutes );
app.use('/api/activity-category-definition', checkIfAuthenticated, activityCategoryDefinitionRoutes);
app.use('/api/schedule-day-template', checkIfAuthenticated, scheduleDayTemplateRoutes);
app.use('/api/schedule-rotation', checkIfAuthenticated, scheduleRotationRoutes);
app.use('/api/task', checkIfAuthenticated, taskRoutes);
app.use('/api/notebook', checkIfAuthenticated, notebookRoutes);
app.use('/api/serverScripts', checkIfAuthenticated, serverScriptsRoutes);
app.use('/api/routine-definition', checkIfAuthenticated, routineDefinitionRoutes);
app.use('/api/daily-task-list', checkIfAuthenticated, dailyTaskListRoutes);
app.use('/api/social', checkIfAuthenticated, socialRoutes);
app.use('/api/daybook-day-item', checkIfAuthenticated, daybookDayItemRoutes);
app.use('/api/sleep-manager', checkIfAuthenticated, sleepManagementRoutes);





app.use('/', function(req, res) {
  res.sendFile(path.resolve('public/index.html'))
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
