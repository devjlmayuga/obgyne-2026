const dbConnection = require('../connection/db_connetion');

/**
 *
 * @param {*} lookUpType
 * @param {*} lookUpId

 */
async function isValid(lookUpType, lookUpId) {
  console.log('entering isValid dao');
  let poolConnection = null;
  const queryText = `
      SELECT 1 FROM ob.look_up WHERE look_up_type = $1 AND look_up_id = $2
  `;
  const params = [lookUpType, lookUpId];
  try {
    poolConnection = await dbConnection.createPoolConnection(); // always start db connection
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    console.log('error');
    await poolConnection.end(); // always close db connection
    return error;
  }
}

exports.isValid = isValid;
