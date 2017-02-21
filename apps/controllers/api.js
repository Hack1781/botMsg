const express = require('express');
const router = express.Router();
const winston = require('winston');
const celabDao = require('../dao/celab');
const Content = require('../services/content');

 const logger = new (winston.Logger)({
   level: "info",
    transports: [
      new (winston.transports.File)({ filename: 'debug.log' })
    ]
  });

router.get('/celabs', function(request, response) {

  logger.info('get > celabs');

  celabDao.findAll().then(rows => {
    response.send(rows);
  });
});

/**
 * 컨텐츠 더보기 API
 * - 봇에서 '더보여줘'를 했을때 해당 셀럽의 컨텐츠를 랜덤으로 더보여준다
 * - {media-type}을 ALL로 했을때는 날씨를 제외한 모든 컨텐츠중에서 보여준다
 *
 * /contents/celeb/{celeb-type}/media/{media-type}
 *
 * response : {
 *  media :
 *  url :
 *  title :
 *  image :
 *  text :
 * }
 *
 */
router.get('/contents', function(request, response) {
  let params = request.query;
  let id = params.id ? params.id : 1;

  Content.find(id).then(function(result) {
    response.send(result);
  });
});

router.get('/contents/more', function(request, response) {
  let params = request.query;

  Content.getMoreContentsAboutCeleb(params.topic).then(msg => {
    if (!msg) {
      response.status(400).send('unknown topic : ' + params.topic);
    }
    response.send({topic: params.topic, client_id: params.client_id, msg: msg});
  });
});

/**
 * 컨텐츠 등록 API
 * - 대룡이Crawler에서 등록한 셀럽의 컨텐츠 정보를 array로 보낸다
 *
 *
 * /contents/celeb/{celeb-type}/media/{media-type}
 * req : [{
 *   url :
 *   title :
 *   image :
 *   text :
 *   contentsDate : yyyyMMdd
 *   viewCount :
 * }]
 */
router.post('/contents', function(request, response) {
  // celab type으로 celeb id 정보를 얻어온다. Crawler.find(type)
  let params = request.body;
  if (params.title) {
    params.title = encodeURI(params.title);
  }

  logger.info('post > contents [' + JSON.stringify(params, null, 2) + ']');

  Content.add(params).then(function(result) {
    response.send('OK')
  });
});

/**
 * TODO :
 * celab -> celeb
 *
 * Batch 돌려야함
 * node-cron 같은거 써서 하면 되지 않을까?
 * Contents Table에 publish_all_yn 필드 만듦
 * 그리고 해당 요일에 viewcount 높은순&최신&(publish_all_yn='N') 인 데이터 보내주고
 * 보내준 애는 publish_all_yn='Y' 로 업데이트
 *
 * 배치애서 시간별로 컨텐츠를 보내줄지(셀럽과 관계없이 공통으로) 코드에 스케줄링 Object로 하나 만들어둠
 *
 * 그리고 만약 '더보기'기능을 구현한다면 userId = [1,3,5,6,7,9] 이런식으로 추가로 보기를 요청한 것들에 대해서
 * redis 에 key-value mapping을 해 놓아야함. 뭐 하루단위로 clear 한다고 하는 가정하에ㅎ
 * 어떤 컨텐츠를 보여줄지는 랜덤으로
 *
 *  컨텐츠 타입별 - 메세지 그룹을 설정해서
 *  유투브,트위터,날씨를 보낼때 어떤 메세지를 보낼지 코드에 설정해놓는다
 *  랜덤으로 하나 골라서 Wrapping해서 보내기만 하면 됨
 *
 *  날씨는 어떤 데이터를 정형화해서 받아야할지 고민을 해보자
 */
module.exports = router;
