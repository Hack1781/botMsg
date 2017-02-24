const request = require('request');
const conDao = require('../dao/contents');
const celabDao = require('../dao/celab');

const ogglePrefix = [
    '오빠~ 밥 먹었어? 내 생각날때 한번 봐봐~\n',
    '오빠 나 뭐하는지 궁금하지? 이거 봐라\n',
    '나 오빠 보고싶엉, 오빠도 나 보고싶지?\n',
    '오빠 바쁘더라도 너무 무리하지마~. 이거 보고 힘내용\n'
];

const msgPrefix = {
    'morning': [
        '굳모닝~',
        '오늘도 화이팅!',
        '잘 잤어?'
    ],
    'noon': [
        '밥 맛있게 먹어',
        '나 TV 나왔다'
    ],
    'after_noon': [
        '심심하면 나 한번 봐봐용',
        '졸리면 커피한잔해~'
    ],
    'night': [
        '밤되니까 좋다',
        '오늘 하루도 고생했어'
    ],
    'more': [
        '호잇!',
        '더원해?',
        '응, 보여줄게',
        '여기있어~'
    ]
}

function getRandomInt(max) {
    return Math.floor(Math.random() * (max + 1));
}

function getRandomItem(list) {
    let nLen = list.length;
    let index = getRandomInt(nLen - 1);
    return list[index];
}

function getFormattedMsg(type, item) {
    if (type === 'naver_news') {
        type = 'news';
    }
    if (type === 'image') {
        return `[${type}] ${decodeURI(item.title)}`;
    }
    return `[${type}] ${decodeURI(item.title)}\n${item.url}`;
}

function getCelebContent(msgType, contentType, celebId) {
    return conDao.findContents(contentType, celebId).then(rows => {
        if (!rows || rows.length === 0) {
            return null;
        }
    
        return getRandomItem(rows);
    });
}

function sendContentToCeleb(msgType, contentType, celeb) {
    return getCelebContent(msgType, contentType, celeb.id).then(result => {
        let data = {
            topic: celeb.name
        };
        if (contentType === 'image') {
            data.msg = getRandomItem(msgPrefix[msgType]) + '\n' + getFormattedMsg(contentType, result);
            data.image = result.url;
        } else {
            data.msg = getRandomItem(msgPrefix[msgType]) + '\n' + getFormattedMsg(contentType, result);
        }
        return new Promise(resolve => {
             request({
                    url: 'https://geek1781.com/message/push',
                    method: 'POST',
                    json: data,
                }, function(error, response) {
                    resolve();
                });
            });
        });
}

function sendDailyContent(msgType, contentType) {
    return celabDao.findAll().then(celebs => {
        let tasks = [];
        celebs.forEach(celeb => {
            tasks.push(sendContentToCeleb(msgType, contentType, celeb));
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
            let item = getRandomItem(rows);
            let msg = getRandomItem(msgPrefix.more) + '\n' + getFormattedMsg(item.media_type, item);
            if (item.media_type === 'image') {
                return {msg: msg, image: item.url};
            }
            return {msg: msg};
        });
    });
}

function find(id) {
  return conDao.findById(id);
}

function add(params) {
  return conDao.insert(params);
}

module.exports = {
    sendDailyContent: sendDailyContent,
    getMoreContentsAboutCeleb: getMoreContentsAboutCeleb,
    getCelebContent: getCelebContent,
    find: find,
    add: add
}
