
const crontab = require('node-crontab');
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


crontab.scheduleJob("0 13 * * *", async function () { // 13:00
    try {
        await Content.sendDailyContent('noon', 'image');
        logger.info('noon batch > success');
    } catch (e) {
        logger.info('noon batch > error : ' + e);
    }
});

crontab.scheduleJob("0 19 * * *", async function () { // 21:00
    try {
        await Content.sendDailyContent('night', 'image');
        logger.info('noon batch > success');
    } catch (e) {
        logger.info('noon batch > error : ' + e);
    }
});