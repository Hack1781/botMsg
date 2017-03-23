"use strict";

const factory = require('./connection-factory');
const db = factory.createDao();

db.table = 'contents';
db.findNewstContents = function(mediaType, celebId) {
    return this.knex(this.table).where({
        'media_type': mediaType,
        'celab_id': celebId,
        'publish_yn': 'N'
    }).orderBy('content_date', 'desc').select().limit(3);
};

module.exports = db;

