const request = require('request');
const conDao = require('../dao/contents');
const celabDao = require('../dao/celab');

const ogglePrefix = [
    '오빠~ 밥 먹었어? 내 생각날때 한번 봐봐~\n',
    '오빠 나 뭐하는지 궁금하지? 이거 봐라\n',
    '나 오빠 보고싶엉, 오빠도 나 보고싶지?\n',
    '오빠 바쁘더라도 너무 무리하지마~. 이거 보고 힘내용\n'
];

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
            return ogglePrefix[getRandomInt(ogglePrefix.length - 1)] + rows[index].url;
        }
        return null;
    });
}

function sendContentToCeleb(type, celeb) {
    return getCelebContent(type, celeb.id).then(result => {
        return new Promise(resolve => {
             request({
                    url: 'https://geek1781.com/message/push',
                    method: 'POST',
                    json: {
                        topic: celeb.name,
                        msg: result
                    }
                }, function(error, response) {
                    resolve();
                });
            });
        });
}

function sendDailyContent(type) {
    return celabDao.findAll().then(celebs => {
        let tasks = [];
        celebs.forEach(celeb => {
            tasks.push(sendContentToCeleb(type, celeb));
        });

        return Promise.all(tasks);
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
            return ogglePrefix[getRandomInt(ogglePrefix.length - 1)] + rows[index].url;
        });
    });
}


module.exports = {
    sendDailyContent: sendDailyContent,
    getMoreContentsAboutCeleb: getMoreContentsAboutCeleb
}