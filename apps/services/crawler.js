const celabDao = require('../dao/celab');
const contentsDao = require('../dao/contents');

function find(id) {
  return celabDao.findById(id);
}

function add(params) {
  return celabDao.insert(params);
}

module.exports = {
  find: find,
  add: add
};