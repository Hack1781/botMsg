const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const config = require('config');
const batch = require('./apps/services/batch');

const app = express();

const api = require('./apps/controllers/api');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', api);

module.exports = app;
