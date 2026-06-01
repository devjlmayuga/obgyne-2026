const dbConnection = require('../connection/db_connetion');

/**
 *
 * @param {*} data
 */
async function insertPatientDiagnosis(data) {
  console.log('entering insertPatientDiagnosis dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
      INSERT INTO ob.patient_diagnosis ( patient_id, comment ) VALUES ( $1 , $2 )
  `;
  const params = [data.patient_id, data.comment];
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
async function updatePatientDiagnosis(data) {
  console.log('entering updatePatientDiagnosis dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    UPDATE ob.patient_diagnosis SET comment = $1 WHERE patient_id = $2
  `;
  const params = [data.comment, data.patient_id];
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


async function getPatientDiagnosisList() {
  console.log('entering getPatientDiagnosisList dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT * FROM ob.patient_diagnosis;
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
async function getPatientDiagnosisListByPatientId(patientId) {
  console.log('entering getPatientDiagnosisListByPatientId dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT * FROM ob.patient_diagnosis WHERE patient_id = $1;
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
async function deletePatientDiagnosis(data) {
  console.log('entering deletePatientDiagnosis dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    DELETE FROM ob.patient_diagnosis WHERE patient_id = $1 AND patient_diagnosis_id = $2;`;
  const params = [data.patient_id, data.patient_diagnosis_id];
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

exports.insertPatientDiagnosis = insertPatientDiagnosis;
exports.getPatientDiagnosisList = getPatientDiagnosisList;
exports.updatePatientDiagnosis = updatePatientDiagnosis;
exports.getPatientDiagnosisListByPatientId = getPatientDiagnosisListByPatientId;
exports.deletePatientDiagnosis = deletePatientDiagnosis;
