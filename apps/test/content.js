const Content = require('../services/content');

/*
Content.sendContentToUser('Cfa93254a62526c4262ffe8a9d743bd4c', 'noon', 'image').then((result) => {
    console.log (result);

}).catch(e => {
    console.log (e);
})*/

Content.sendDailyContent('night', 'image', 3).then(a => {
    console.log (a);
}).catch(e => {
    console.log (e);
});