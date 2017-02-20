
var crontab = require('node-crontab');

const request = require('request');
const URL = 'abdfdfdf';
const Content = require('../content');
const winston = require('winston');
const logger = new (winston.Logger)({
   level: "info",
    transports: [
      new (winston.transports.File)({ filename: 'debug.log' })
    ]
  });


crontab.scheduleJob("0 8 * * *", function(){ // 8:00
    Content.sendDailyContent('naver_news').then(result => {
        logger.info('morning batch > success');
    }).catch(error => {
        logger.info('morning batch > error : ' + error);
    });
});

crontab.scheduleJob("0 14 * * *", function(){ // 14:00
    Content.sendDailyContent('youtube').then(result => {
        logger.info('noon batch > success');
    }).catch(error => {
        logger.info('noon batch > error : ' + error);
    });
});
