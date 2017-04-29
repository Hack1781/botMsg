
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

crontab.scheduleJob("0 9 * * * 1-5", async function () { // 9:00
    try {
        await Content.sendDailyContent('morning', 'image', 3);
        logger.info('noon batch > success');
    } catch (e) {
        logger.info('noon batch > error : ' + e);
    }
});

crontab.scheduleJob("0 13 * * * 1-5", async function () { // 13:00
    try {
        await Content.sendDailyContent('afternoon', 'image', 1);
        logger.info('noon batch > success');
    } catch (e) {
        logger.info('noon batch > error : ' + e);
    }
});

crontab.scheduleJob("0 19 * * * 1-5", async function () { // 19:00
    try {
        await Content.sendDailyContent('evening', 'image', 2);
        logger.info('noon batch > success');
    } catch (e) {
        logger.info('noon batch > error : ' + e);
    }
});

crontab.scheduleJob("0 22 * * * 1-5", async function () { // 22:00
    try {
        await Content.sendDailyContent('night', 'image', 4);
        logger.info('noon batch > success');
    } catch (e) {
        logger.info('noon batch > error : ' + e);
    }
});