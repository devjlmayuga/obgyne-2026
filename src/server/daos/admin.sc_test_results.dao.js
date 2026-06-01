const dbConnection = require('../connection/db_connetion');

/**
 *
 * @param {*} data
 */
async function saveTestResults(data) {
  console.log('entering saveTestResults dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `

      INSERT INTO ob.patient_test_results ( patient_id, test_type, file_path, google_id) 
        VALUES ( $1, $2, $3, $4 ) RETURNING *
  `;

  const params = [data.patient_id, data.test_type, data.file_path, data.google_id];
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
 * @param {*} schedule_checkup_id
 * @param {*} date
 */
async function getPatientTestResultByDate(patientId, date) {
  console.log('entering getPatientTestResultByDate dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT 
      patient_test_results.*,
      look_up.value AS test_type_value
    FROM ob.patient_test_results 
    LEFT JOIN ob.look_up ON look_up.look_up_id = CAST (patient_test_results.test_type AS INTEGER)
    WHERE patient_test_results.last_edit_date::date = $1 AND patient_test_results.patient_id = $2;
  `;
  const params = [date, patientId];
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
 * @param {*} schedule_checkup_id
 */
async function getPatientTestResultByScheduleCheckupId(scheduleCheckupId) {
  console.log('entering getPatientTestResultByScheduleCheckupId dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT 
      patient_test_results.*,
      look_up.value AS test_type_value
    FROM ob.patient_test_results 
    LEFT JOIN ob.look_up ON look_up.look_up_id = CAST (patient_test_results.test_type AS INTEGER)
    WHERE patient_test_results.schedule_checkup_id = $1;
  `;
  const params = [scheduleCheckupId];
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
async function getPatientTestResultByPatientId(patientId) {
  console.log('entering getPatientTestResultByPatientId dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT * FROM ob.patient_test_results
      WHERE sc_test_results.schedule_checkup_id IN (
        SELECT schedule_checkup.schedule_checkup_id 
        FROM ob.schedule_checkup 
        WHERE schedule_checkup.patient_id = $1
      );

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
async function getTestResultViaPatientId(patientId) {
  console.log('entering getTestResultViaPatientId dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    select 
      str.*
    from ob.patient_test_results str
    where str.patient_id = $1

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

exports.saveTestResults = saveTestResults;
exports.getPatientTestResultByDate = getPatientTestResultByDate;
exports.getPatientTestResultByScheduleCheckupId = getPatientTestResultByScheduleCheckupId;
exports.getPatientTestResultByPatientId = getPatientTestResultByPatientId;
exports.getTestResultViaPatientId = getTestResultViaPatientId;