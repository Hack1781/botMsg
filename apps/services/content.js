//const 
const conDao = require('../dao/contents');
const celabDao = require('../dao/celab');

function getCelebContent(type, celebId) {
    return conDao.findContents(type, celebId).then(rows => {
        if (rows && rows.length > 0) {
            return rows[0].url;
        }
    });
}

function getDailyContent(type) {
    celabDao.findAll().then(rows => {
        rows.forEach(row => {
            return getCelebContent('youtube', row.id).then(result => {
                //request.post({url: URL, data: result});
            });
        });
    });
}

module.exports = {
    getDailyContent: getDailyContent
}