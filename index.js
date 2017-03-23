const path = require('path');
const bodyParser = require('body-parser');
const config = require('config');
const Koa = require('koa');
const app = new Koa();
const koaBody   = require('koa-body');

const api = require('./apps/controllers/api');
const batch = require('./apps/services/batch');


app.use(koaBody({formidable:{uploadDir: __dirname}}));
app.use(api.routes());

module.exports = app;
