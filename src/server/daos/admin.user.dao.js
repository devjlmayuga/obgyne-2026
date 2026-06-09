const dbConnection = require('./../connection/db_connetion');
const crypto = require('crypto');

function md5Password(password) {
  return crypto
    .createHash('md5')
    .update(password || '')
    .digest('hex');
}

async function insertData() {
  console.log('entering insertData dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
      INSERT INTO ob.user ( first_name, last_name ) VALUES ( $1 , $2 )
  `;
  const params = ['JL', 'MAYUGA'];
  try {
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return {err : error};
  }
}


async function getList() {
  console.log('entering getList dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection

  const queryText = `
      SELECT * FROM ob.user;
  `;

  try {
    const { rows } = await poolConnection.query(queryText);
    await poolConnection.end(); // dont forget to end the connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return {err : error};
  }
}

/**
 * @param {*} user
 */
async function isUserExisting(user) {
  const poolConnection = await dbConnection.createPoolConnection();  
  try {
    const hashedPassword = md5Password(user.password);
    const sqlQuery = 'SELECT pword FROM ob.user WHERE uname = $1 AND (pword = $2 OR pword = $3)';
    const params = [user.username, hashedPassword, user.password];
    const { rows } = await poolConnection.query(sqlQuery, params);
    if (rows && rows.length === 1) {
      if (rows[0].pword !== hashedPassword) {
        await poolConnection.query(
          'UPDATE ob.user SET pword = $1 WHERE uname = $2',
          [hashedPassword, user.username]
        );
      }
      return true;
    } 
  } catch (error) {
    console.log('Error method: isUserExist Dao | message: ', error);
  } finally {
    await poolConnection.end();
  }
  return false;
}

/**
 *
 * @param {*} newPassword
 */
async function resetPassword(username, newPassword) {
  console.log('entering resetPassword dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection

  const queryText = `
      UPDATE ob.user SET pword = $1 WHERE uname = $2;
  `;

  const params = [md5Password(newPassword), username];

  try {
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // dont forget to end the connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return {err : error};
  }
}

exports.insertData = insertData;
exports.getList = getList;
exports.isUserExisting = isUserExisting;
exports.resetPassword = resetPassword;
