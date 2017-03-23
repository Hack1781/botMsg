const request = require('request');
const conDao = require('../dao/contents');
const celabDao = require('../dao/celab');
const userDao = require('../dao/users');
const pushDao = require('../dao/push');
const stageDao = require('../dao/game-stage');
const gameMsgDao = require('../dao/game-msg');

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
    return conDao.findNewstContents(contentType, celebId).then(rows => {
        if (!rows || rows.length === 0) {
            return null;
        }
    
        return getRandomItem(rows);
    });
}

async function getRandomMessage(msgType) {
    const msgs = await pushDao.findTypedMsg(msgType);

    return getRandomItem(msgs).msg;
}

async function sendContentAboutCeleb(msgType, contentType, celebId, minNumPush) {
    const content = await getCelebContent(msgType, contentType, celebId);
    let data = {};
    const msg = await getRandomMessage(msgType);
    if (contentType === 'image') {
        data.msg = msg;
        data.image = content.url;
    } else {
        data.msg = msg + '\n' + getFormattedMsg(contentType, content);
    }

    const promises = [];
    const users = await userDao.findBy('celab_id', celebId);

    users.forEach((user) => {
        if (user.num_push < minNumPush) {
            return;
        }
        promises.push(requestAsync('https://geek1781.com/message/push', 'POST', Object.assign({client_id: user.id}, data)));
    });

    if (promises.length > 0) {
        await conDao.update(content.id, {publish_yn: 'Y'});
    }

    return Promise.all(promises);
}

async function sendDailyContent(msgType, contentType, minNumPush) {
    const celabs = await celabDao.findAll();

    const promises = [];
    celabs.forEach(celab => {
        promises.push(sendContentAboutCeleb(msgType, contentType, celab.id, minNumPush));
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
    let msg = getFormattedMsg(item.media_type, item);
    if (item.media_type === 'image') {
        return { msg: '', image: item.url };
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
        data.msg = msg;
        data.image = content.url;
    } else {
        data.msg = msg + '\n' + getFormattedMsg(contentType, content);
    }
    return requestAsync('https://geek1781.com/message/push', 'POST', data);
}

async function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    })
}

async function getSimulationAnswer(msgId = null) {
    if (msgId === null) {
        return null;
    }

    const msg = await gameMsgDao.findById(msgId);
    return {
        msg: msg.response_msg,
        image: msg.response_image,
        continue: msg.answer_yn === 'Y'
    }
}

async function getSimulationNext(msgId) {
    let stage, stageNo, msg;
    if (msgId === null) {
        stage = await stageDao.findOneBy('stage_no', 1);
        stageNo = 1;
    } else {
        msg = await gameMsgDao.findById(msgId);
        stageNo = msg.stage_no + 1;
        stage = await stageDao.findOneBy('stage_no', stageNo);
        if (!stage) {
            return {};
        }
    }

    const stageMsgs = await gameMsgDao.findBy('stage_no', stageNo);
    const actions = [];
    const optionKeys = ['a', 'b', 'c', 'd'];
    stageMsgs.forEach((msg, index) => {
        actions.push({
            "type": "postback",
            "label": msg.msg,
            "data": "quiz:" + msg.id
        });
    })

    return {
        stage,
        actions
    };
}

async function simulateDate(userId, msgId = null) {
    if (!msgId && msgId !== 0) {
        msgId = null;
    }
    if (msgId !== null) {
        const answer = await getSimulationAnswer(msgId);

        await requestAsync('https://geek1781.com/message/push', 'POST', {
            client_id: userId,
            msg: answer.msg,
            image: answer.image
        });

        if (!answer.continue) {
            await sleep(500);
            return { msg: 'end' };
        }

        await sleep(1000);
    };

    const {stage, actions} = await getSimulationNext(msgId);
    if (!stage) {
        await userDao.update(userId, {winner: 1});
        return { msg: 'finish'};
    }

    await requestAsync('https://geek1781.com/message/push', 'POST', {
        client_id: userId,
        msg: stage.msg
    });

    await sleep(500);

    const responseMsg = {
        "client_id": userId,
        "type": "template",
        "altText": "모바일에서 확인 해 주세요~",
        "template": {
            "type": "buttons",
            "thumbnailImageUrl": stage.image,
            "title": stage.title,
            "text": '당신의 선택은?',
            "actions": actions
        }
    }

    return responseMsg;
}

module.exports = {
    sendDailyContent: sendDailyContent,
    getMoreContentOfUser: getMoreContentOfUser,
    getCelebContent: getCelebContent,
    find: find,
    add: add,
    sendContentToUser: sendContentToUser,
    simulateDate: simulateDate
}
