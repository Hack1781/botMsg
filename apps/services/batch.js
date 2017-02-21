
var crontab = require('node-crontab');

const request = require('request');
const URL = 'abdfdfdf';
const Content = require('./content');
const winston = require('winston');
const logger = new (winston.Logger)({
   level: "info",
    transports: [
      new (winston.transports.File)({ filename: 'debug.log' })
    ]
  });


crontab.scheduleJob("0 9 * * *", function(){ // 9:00
    Content.sendDailyContent('morning', 'naver_news').then(result => {
        logger.info('morning batch > success');
    }).catch(error => {
        logger.info('morning batch > error : ' + error);
    });
});

crontab.scheduleJob("0 13 * * *", function(){ // 13:00
    Content.sendDailyContent('noon', 'youtube').then(result => {
        logger.info('noon batch > success');
    }).catch(error => {
        logger.info('noon batch > error : ' + error);
    });
});

crontab.scheduleJob("0 16 * * *", function(){ // 16:00
    Content.sendDailyContent('after_noon', 'naver_news').then(result => {
        logger.info('morning batch > success');
    }).catch(error => {
        logger.info('morning batch > error : ' + error);
    });
});

crontab.scheduleJob("0 21 * * *", function(){ // 21:00
    Content.sendDailyContent('night', 'youtube').then(result => {
        logger.info('noon batch > success');
    }).catch(error => {
        logger.info('noon batch > error : ' + error);
    });
});


crontab.scheduleJob("39 22 * * *", function(){ // 14:00
    Content.sendDailyContent('youtube').then(result => {
        logger.info('noon batch > success');
    }).catch(error => {
        logger.info('noon batch > error : ' + error);
    });
});
