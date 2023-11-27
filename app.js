var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

mongoose.connect('mongodb://localhost:27017/placement-cell', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: String,
  regNo: Number,
  email: String,
  password: String
});

const User = mongoose.model('Student', userSchema);

//.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.post('/StudentRegister', async(req, res) => {
  const { name, regNo, email, password } = req.body;

  // Create a new user
  const newUser = new User({ name, regNo, email, password });

  // Save the user to the database
  /*newUser.save((err) => {
    if (err) {
      console.error(err);
      res.send('Error registering user.');
    } else {
      res.send('User registered successfully.');
    }
  });*/
  try {
    // Save the user to the database
    await newUser.save();
    res.render('StudentLogin');//User registered successfully.');
  } catch (err) {
    console.error(err);
    res.send('Error registering user.');
  }
});

app.get('/StudentLogin', (req, res) => {
  res.render('StudentLogin');
});

app.post('/StudentLogin', async(req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists in the database
    const user = await User.findOne({ email, password }).exec();

    if (user) {
      res.send('Login successful.');
    } else {
      res.send('Invalid username or password.');
    }
  } catch (err) {
    console.error(err);
    res.send('Error during login.');
  }
  // Check if the user exists in the database
 /* User.findOne({ email, password }, (err, user) => {
    if (err) {
      console.error(err);
      res.send('Error during login.');
    } else if (user) {
      res.send('Login successful.');
    } else {
      res.send('Invalid username or password.');
    }
  });*/
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });*/

const PORT = 4500;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;
