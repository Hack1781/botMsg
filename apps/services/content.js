const request = require('request');
const conDao = require('../dao/contents');
const celabDao = require('../dao/celab');
const userDao = require('../dao/users');

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

function find(id) {
  return conDao.findById(id);
}

function add(params) {
  return conDao.insert(params);
}

function requestAsync(url, method, data) {
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: method,
            json: data,
        }, function (error, response) {
            if (error) {
                return reject(error);
            }
            resolve();
        });
    });
}

function getCelebContent(msgType, contentType, celebId) {
    return conDao.findContents(contentType, celebId).then(rows => {
        if (!rows || rows.length === 0) {
            return null;
        }
    
        return getRandomItem(rows);
    });
}

async function sendContentAboutCeleb(msgType, contentType, celebId, minNumPush) {
    const content = await getCelebContent(msgType, contentType, celebId);
    let data = {};
    if (contentType === 'image') {
        data.msg = getRandomItem(msgPrefix[msgType]);
        data.image = content.url;
    } else {
        data.msg = getRandomItem(msgPrefix[msgType]) + '\n' + getFormattedMsg(contentType, content);
    }

    const promises = [];
    const users = await userDao.findBy('celab_id', celebId);

    users.forEach((user) => {
        if (user.num_push < minNumPush) {
            return;
        }
        promises.push(requestAsync('https://geek1781.com/message/push', 'POST', data));
    });

    if (promises.length > 0) {
        await conDao.update(content.id, {publish_yn: 'Y'});
    }

    return Promise.all(promises);
}

async function sendDailyContent(msgType, contentType, minNumPush) {
    const celabs = await celabDao.findAll();

    const promises = [];
    celebs.forEach(celeb => {
        promises.push(sendContentAboutCeleb(msgType, contentType, celeb, minNumPush));
    });

    return Promise.all(promises);
}

async function getMoreContentOfUser(userId, type) {
    const user = await userDao.findById(userId);
    const celab = await celabDao.findById(user.celab_id);

    const contentParam = {
        celab_id: celab.id
    }
    if (type) {
        contentParam.media_type = type;
    }
    const contents = await conDao.findByParams(contentParam);

    if (contents.length === 0) {
        return null;
    }
    let item = getRandomItem(contents);
    let msg = getRandomItem(msgPrefix.more) + '\n' + getFormattedMsg(item.media_type, item);
    if (item.media_type === 'image') {
        msg = getRandomItem(msgPrefix.more);
        return { msg: msg, image: item.url };
    }
    return { msg: msg };
}

async function sendContentToUser(userId, msgType, contentType) {
    const user = await userDao.findById(userId);
    const content = await getCelebContent(msgType, contentType, user.celab_id);
    const data = {
        client_id: userId
    };
    if (contentType === 'image') {
        data.msg = getRandomItem(msgPrefix[msgType]);
        data.image = content.url;
    } else {
        data.msg = getRandomItem(msgPrefix[msgType]) + '\n' + getFormattedMsg(contentType, content);
    }
    return requestAsync('https://geek1781.com/message/push', 'POST', data);
}

module.exports = {
    sendDailyContent: sendDailyContent,
    getMoreContentOfUser: getMoreContentOfUser,
    getCelebContent: getCelebContent,
    find: find,
    add: add,
    sendContentToUser: sendContentToUser
}
