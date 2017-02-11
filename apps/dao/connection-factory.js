const _ = require('lodash');
const config = require('config');
const connectInfo = config.get('db');
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host    : connectInfo.host,
    port : connectInfo.port,
    user : connectInfo.user,
    password : connectInfo.password,
    database:'girl',
    charset  : 'utf8',
    dateStrings : true
  },
  pool: {
    min: 0,
    max: 1
  }
});

const prototype = {
  knex: knex,
  findById: function(id) {
    return this.knex(this.table).where('id', id).first();
  },
  findAll: function(columns, orderColumn) {
    let q = this.knex(this.table).select();
    if (_.isArray(columns)) {
      q = q.column(columns);
    }
    if (orderColumn) {
      q = q.orderBy(orderColumn);
    }
    return q;
  },
  findBy: function(column, value) {
    return this.knex(this.table).where(column, value).select();
  },
  count: function() {
    return this.knex(this.table).count('id');
  },
  update: function(id, params) {
    return this.knex(this.table).where('id', id).update(params);
  },
  insert: function(params) {
    return this.knex(this.table).insert(params);
  },
  del: function(id) {
    return this.knex(this.table).where('id', id).del();
  }
};

module.exports = {
  createDao: function() {
    return Object.create(prototype);
  }
};