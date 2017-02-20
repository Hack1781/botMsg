const request = require('request');
const conDao = require('../dao/contents');
const celabDao = require('../dao/celab');

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function getCelebContent(type, celebId) {
    return conDao.findContents(type, celebId).then(rows => {
        if (rows.length === 0) {
            return null;
        }
        let index = getRandomInt(rows.length - 1);
        if (rows && rows.length > 0) {
            return rows[index].url;
        }
    });
}

function sendDailyContent(type) {
    celabDao.findAll().then(celebs => {
        celebs.forEach(celeb => {
            return getCelebContent(type, celeb.id).then(result => {
                request({
                    url: 'https://geek1781.com/message/push',
                    method: 'POST',
                    json: {
                        topic: celeb.name,
                        msg: result
                    }
                });
            });
        });
    });
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
    sendDailyContent: sendDailyContent,
    getMoreContentsAboutCeleb: getMoreContentsAboutCeleb
}