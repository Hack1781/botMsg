
var crontab = require('node-crontab');

const request = require('request');
const URL = 'abdfdfdf';
const Content = require('../content');

crontab.scheduleJob("*/2 * * * *", function(){ // 2:00
    Content.getDailyContent().then(result => {

    });
    
});

crontab.scheduleJob("*/2 * * * *", function(){ // 4:00
    console.log("It's been 2 minutes!");
});
