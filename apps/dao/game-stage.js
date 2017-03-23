"use strict";

const factory = require('./connection-factory');
const db = factory.createDao();

db.table = 'game_stage';

module.exports = db;
