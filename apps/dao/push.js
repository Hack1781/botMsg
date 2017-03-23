"use strict";

const factory = require('./connection-factory');
const db = factory.createDao();

db.table = 'push';

db.findTypedMsg = function (type) {
    return this.knex(this.table)
        .where('type', type).orWhere('type', 'all').select();
}

module.exports = db;
