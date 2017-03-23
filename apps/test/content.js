const Content = require('../services/content');

Content.sendContentToUser('Cfa93254a62526c4262ffe8a9d743bd4c', 'noon', 'image').then(() => {

}).catch(e => {
    console.log (e);
})