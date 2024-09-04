var pg = require('pg-promise')();

//Awas ProductionDB
var db = pg('postgres://postgres:19216801@10.10.30.11:5432/SKB3');
var dbsfa = pg('postgres://postgres:19216801@10.10.30.11:5432/SFA');

module.exports = {db, dbsfa}