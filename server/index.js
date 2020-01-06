require('./config/config'); //Configuration
require('./models/db'); //Connexion à la bdd
require('./config/passportConfig'); //Passport configuration

//On appelle les modules qu'on va utiliser
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');

const rtsIndex = require('./routes/index.router');

var app = express();

//On dit à l'application ce qu'on va utiliser
app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize());
app.use('/api', rtsIndex); // define URL '/api' to call the router

// error handler
app.use((err, req, res, next) => {
    if(err.name == 'ValidationError') {
        var valErrors = [];
        Object.keys(err.errors).forEach(key => valErrors.push(err.errors[key].message));
        res.status(422).send(valErrors);
    }
});

// start server
app.listen(process.env.PORT, () => console.log('Server started at port : ' + process.env.PORT));

