/* eslint-disable no-unused-vars */
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

// global features importing
const routerModule = require('./routes');
const {errorConverter, errorHandler} = require('./features/error');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(routerModule);
app.use(errorConverter);
app.use(errorHandler);
module.exports = app;
