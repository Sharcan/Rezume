require('./config/config'); //Configuration
require('./models/db'); //Connexion à la bdd
require('./config/passportConfig'); //Passport configuration

//On appelle les modules qu'on va utiliser
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport')

const rtsRegistration = require('./routes/registration.router');
const rtsStudent = require('./routes/student.router');
const rtsCompany = require('./routes/company.router');
const rtsCv = require('./routes/cv.router');
const rtsJob = require('./routes/cv.router');

var app = express();

//On dit à l'application ce qu'on va utiliser
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsRegistration, rtsStudent, rtsCompany, rtsCv, rtsJob); // define URL '/api' to call the router

// error handler
app.use((err, req, res, next) => {
    if(err.name == 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors)
    }
});

// start server
app.listen(process.env.PORT, () => console.log('Server started at port : ' + process.env.PORT));

