const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database')
const expressSession = require('express-session');
// Connect To Database I

mongoose.connect(config.database);

// 0n Connectlon

mongoose.connection.on('connected', () => {
  console.log('Connected to database '+config.database);
});

// On Error

mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const app = express();

const users = require('./routes/users');

// Port Number

const port = 3000;

// CORS middleware

app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public' ) ) );

// Body Parser middleware

app.use(bodyParser.json());

// Passport Middleware

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

// Index Route

app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// Start Server

app.listen(port, () => {
  console.log('Server started on port '+port);
});