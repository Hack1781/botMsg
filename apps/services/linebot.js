const celabDao = require('../dao/celab');
const contentsDao = require('../dao/contents');

function find(id) {
  return contentsDao.findById(id);
}

function add(params) {
  return contentsDao.insert(params);
}

module.exports = {
  find: find,
  add: add
};