const { Pool, types } = require('pg');
const config = require('../configuration');
// fix for dont allow returning timestamp the data type of DATE on the DB
types.setTypeParser(1082, function(val) {
  return val
})

async function createPoolConnection() {
  const pool = new Pool(config.db);
  return pool;
}

exports.createPoolConnection = createPoolConnection;
