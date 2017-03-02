
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


crontab.scheduleJob("0 13 * * *", function(){ // 13:00
    Content.sendDailyContent('noon', 'image').then(result => {
        logger.info('noon batch > success');
    }).catch(error => {
        logger.info('noon batch > error : ' + error);
    });
});

crontab.scheduleJob("0 19 * * *", function(){ // 21:00
    Content.sendDailyContent('night', 'image').then(result => {
        logger.info('noon batch > success');
    }).catch(error => {
        logger.info('noon batch > error : ' + error);
    });
});