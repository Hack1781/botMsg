"use strict";

const factory = require('./connection-factory');
const db = factory.createDao();

db.table = 'user';

db.increase = function (id, column, num = 1) {
    return this.knex(this.table)
        .where('id', id)
        .increment(column, num)
}

db.decrease = function (id, column, num = 1) {
    return this.knex(this.table)
        .where('id', id)
        .decrement(column, num)
}

module.exports = db;
