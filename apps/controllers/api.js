const express = require('express');
const router = express.Router();
const Crawler = require('../services/crawler');
const Linebot = require('../services/linebot');

router.get('/crawler', function(request, response) {
  let params = request.query;
  let id = params.id ? params.id : 1;
  Crawler.find(id).then(function(result) {
    response.send(result);
  });
});

router.post('crawler', function(request, response) {
  let params = request.body;
  Crawler.add(params).then(function(result) {
    response.send('OK')
  });
});

router.get('/linebot', function(request, response) {
  let params = request.query;
  let id = params.id ? params.id : 1;
  Linebot.find(id).then(function(result) {
    response.send(result);
  });
});

router.post('linebot', function(request, response) {
  let params = request.body;
  Linebot.add(params).then(function(result) {
    response.send('OK')
  });
});


module.exports = router;