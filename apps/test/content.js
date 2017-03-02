const Content = require('../services/content');

Content.sendDailyContent('noon', 'image').then(result => {
    }).catch(error => {
    });