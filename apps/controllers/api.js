const winston = require('winston');
const celabDao = require('../dao/celab');
const userDao = require('../dao/users');
const Content = require('../services/content');
const Router = require('koa-router');

const logger = new (winston.Logger)({
  level: "info",
  transports: [
    new (winston.transports.File)({ filename: 'debug.log' })
  ]
});

const router = new Router();

router.use(async (ctx, next) => {
  if (ctx.method === 'get') {
    console.log (ctx.query);
  } else {
    console.log (ctx.request.body);
  }
  console.log (ctx.url);

  await next(ctx, next);
});

router.get('/celabs', async function (ctx) {
  logger.info('get > celabs');

  const celabs = await celabDao.findAll();

  ctx.body = celabs;
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
router.get('/contents', async (ctx) => {
  const params = ctx.query;
  const id = params.id ? params.id : 1;

  const content = await Content.find(id);
  ctx.body = content;
});

router.get('/contents/more', async function (ctx) {
  let params = ctx.query;

  const data = await Content.getMoreContentsAboutCeleb(params.topic);

  if (!data) {
    ctx.status = 400;
    ctx.body = 'unknown topic : ' + params.topic;
    return;
  }
  if (data.image) {
    ctx.body = { topic: params.topic, client_id: params.client_id, msg: data.msg, image: data.image };
    return;
  }
  ctx.body = { topic: params.topic, client_id: params.client_id, msg: data.msg };
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
router.post('/contents', async function (ctx) {
  // celab type으로 celeb id 정보를 얻어온다. Crawler.find(type)
  let params = ctx.request.body;
  if (params.title) {
    params.title = encodeURI(params.title);
  }

  logger.info('post > contents [' + JSON.stringify(params, null, 2) + ']');

  await Content.add(params);

  ctx.body = 'OK';
});

router.post('/user', async (ctx) => {
  const {user_id, celab_id} = ctx.request.body;

  const user = await userDao.findById(user_id);
  if (user) {
    await userDao.update(user_id, { celab_id });
  } else {
    await userDao.insert({ id: user_id, celab_id, num_push: 0 });
  }
  ctx.body = 'OK';
});

router.post('/user/increase-push', async (ctx) => {
  const {user_id} = ctx.request.body;
  const user = await userDao.findById(user_id);
  if (!user) {
    ctx.status = 400;
    ctx.body = 'USER NOT FOUND';
    return;
  }
  let numPush = user.num_push;
  if (numPush < 4) {
    numPush += 1;
    await userDao.increase(user_id, 'num_push');
  }
  ctx.body = {num_push: numPush };
});

router.post('/user/decrease-push', async (ctx) => {
  const {user_id} = ctx.request.body;
  const user = await userDao.findById(user_id);
  if (!user) {
    ctx.status = 400;
    ctx.body = 'USER NOT FOUND';
    return;
  }
  let numPush = user.num_push;
  if (numPush > 0) {
    numPush -= 1;
    await userDao.decrease(user_id, 'num_push');
  }
  
  ctx.body = {num_push: numPush};
});

module.exports = router;
