const Content = require('../services/content');


Content.getCelebContent('noon', 'youtube', 1).then(result => {
    console.log (result);
}).catch(reason => {
    console.log (reason);
})