const { types } = require('pg');
const postgres = require('postgres');
const config = require('../configuration');

// keep DATE as string
types.setTypeParser(1082, function (val) {
  return val;
});

// Singleton instance using configuration from configuration.js
const sql = postgres({
  ...config.db,
  ssl: 'require',
  connect_timeout: 30,
});

/**
 * Returns the singleton connection object with a shim for legacy .query() and .end() methods.
 */
async function createPoolConnection() {
  // Add .query() shim for legacy DAOs
  if (!sql.query) {
    sql.query = async (text, params) => {
      const rows = await sql.unsafe(text, params || []);
      return { rows };
    };
  }

  // Add .end() shim that does nothing to keep the singleton pool alive
  if (!sql.end_shimmed) {
    sql.end_original = sql.end;
    sql.end = async () => {
      // No-op to prevent DAOs from closing the shared pool
      return Promise.resolve();
    };
    sql.end_shimmed = true;
  }

  return sql;
}

exports.createPoolConnection = createPoolConnection;
exports.sql = sql;




// BEFORE VERCEL NEON Postgress
// const { Pool, types } = require('pg');
// const config = require('../configuration');
// // fix for dont allow returning timestamp the data type of DATE on the DB
// types.setTypeParser(1082, function(val) {
//   return val
// })

// async function createPoolConnection() {
//   const pool = new Pool(config.db);
//   return pool;
// }

// exports.createPoolConnection = createPoolConnection;
