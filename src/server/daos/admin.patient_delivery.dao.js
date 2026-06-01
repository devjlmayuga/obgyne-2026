const dbConnection = require('../connection/db_connetion');

/**
 *
 * @param {*} data
 */
async function insertPatientDelivery(data) {
  console.log('entering insertPatientDelivery dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
      INSERT INTO ob.patient_delivery ( patient_id, year, mode_of_delivery, place_of_delivery, attendant, complications, sort_id ) VALUES ( $1, $2, $3, $4, $5, $6, $7 )
  `;
  const params = [data.patient_id, data.year, data.mode_of_delivery, data.place_of_delivery, data.attendant, data.complications, data.sort_id];
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


/**
 *
 * @param {*} data
 * @param {*} poolConnection
 */
async function updatePatientDelivery(data) {
  console.log('entering updatePatientDelivery dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    UPDATE ob.patient_delivery 
      SET year = $1, mode_of_delivery = $2,  place_of_delivery = $3, attendant = $4, complications = $5, sort_id = $6 WHERE patient_id = $7
  `;
  const params = [data.year, data.mode_of_delivery, data.place_of_delivery, data.attendant, data.complications, data.sort_id, data.patient_id];
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


async function getPatientDeliveryList() {
  console.log('entering getPatientDeliveryList dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT * FROM ob.patient_delivery;
  `;

  try {
    const { rows } = await poolConnection.query(queryText);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return {err : error};
  }
}

/**
 * @param {*} patientId
 */
async function getPatientDeliveryListByPatientId(patientId) {
  console.log('entering getPatientDeliveryListByPatientId dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT * FROM ob.patient_delivery WHERE patient_id = $1 ORDER BY sort_id ASC;
  `;
  const params = [patientId];
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

/**
 *
 * @param {*} patientId
 */
async function deletePatientDelivery(patient_id) {
  console.log('entering deletePatientDelivery dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    DELETE FROM ob.patient_delivery WHERE patient_id = $1`;
  const params = [patient_id];
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

exports.insertPatientDelivery = insertPatientDelivery;
exports.getPatientDeliveryList = getPatientDeliveryList;
exports.updatePatientDelivery = updatePatientDelivery;
exports.getPatientDeliveryListByPatientId = getPatientDeliveryListByPatientId;
exports.deletePatientDelivery = deletePatientDelivery;
