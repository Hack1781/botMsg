"use strict";

const factory = require('./connection-factory');
const db = factory.createDao();

db.table = 'contents';
db.findContents = function(mediaType, celebId) {
    return this.knex(this.table).where({
        'media_type': mediaType,
        'celab_id': celebId
    }).select();
};

module.exports = db;

