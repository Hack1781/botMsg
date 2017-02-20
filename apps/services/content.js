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

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function getMoreContentsAboutCeleb(celebName) {
    return celabDao.findBy('name', celebName).then(celebs => {
        if (celebs.length === 0) {
            return null;
        }
        let celeb = celebs[0];
        return conDao.findBy('celab_id', celeb.id).then(rows => {
            if (rows.length === 0) {
                return null;
            }
            let index = getRandomInt(rows.length - 1);
            return rows[index].url;
        });
    });
}


module.exports = {
    getDailyContent: getDailyContent,
    getMoreContentsAboutCeleb: getMoreContentsAboutCeleb
}