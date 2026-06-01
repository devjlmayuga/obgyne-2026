const dbConnection = require('../connection/db_connetion');

/**
 *
 * @param {*} data
 */
async function insertCheckupHistory(data) {
  console.log('entering insertCheckupHistory dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
      INSERT INTO ob.sc_checkup_history ( 
        schedule_checkup_id,
        checkup_type_id,
       
        
        aog_date,
        aog_remarks,
        aog_by_utz,
        
        weight,
        bp,
        cr,
        temp,
        remarks,

        ob_score,
        lmp,
        aog_weeks,
        aog_days,
        extra_ob_score,
        extra_lmp,
        aog_by_lmp
        
        ) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17 )
  `;
  const params = [
        data.schedule_checkup_id,
        data.checkup_type_id,
       
        
        data.aog_date,
        data.aog_remarks,
        data.aog_by_utz, 
        
        data.weight,
        data.bp,
        data.cr,
        data.temp,
        data.remarks,
        
        data.ob_score,
        data.lmp,
        data.aog_weeks,
        data.aog_days,
        data.extra_ob_score,
        data.extra_lmp,
        data.aog_by_lmp
    ];
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
 */
async function updateCheckupHistory(data) {
  console.log('entering updateCheckupHistory dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
      UPDATE ob.sc_checkup_history 
      SET
        schedule_checkup_id = $1,
        checkup_type_id = $2,

        
        aog_date = $3,
        aog_remarks = $4,
        aog_by_utz = $5,
        
        weight = $6,
        bp = $7,
        cr = $8,
        temp = $9,
        remarks = $10,

        ob_score = $11,
        lmp = $12,
        aog_weeks = $13,
        aog_days = $14,
        extra_ob_score = $15,
        extra_lmp = $16,
        aog_by_lmp = $17,
        
        last_edit_date = now()

      WHERE sc_checkup_history_id = $18
  `;
  const params = [
        data.schedule_checkup_id,
        data.checkup_type_id,

        
        data.aog_date,
        data.aog_remarks,
        data.aog_by_utz, 
        
        data.weight,
        data.bp,
        data.cr,
        data.temp,
        data.remarks,
        
        data.ob_score,
        data.lmp,
        data.aog_weeks,
        data.aog_days,
        data.extra_ob_score,
        data.extra_lmp,
        data.aog_by_lmp,

        data.sc_checkup_history_id
    ];
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
async function updatePatientVitalsigns(data) {
  console.log('entering updatePatientVitalsigns dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    UPDATE ob.sc_vitalsigns 
      SET weight = $1, bp = $2,  cr = $3, temp = $4, remarks = $5 WHERE patient_id = $6
  `;
  const params = [data.weight, data.bp, data.cr, data.temp, data.remarks, data.patient_id];
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


async function getPatientVitalsignsList() {
  console.log('entering getPatientVitalsignsList dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT * FROM ob.sc_vitalsigns;
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
async function getPatientVitalsignsListByPatientId(patientId) {
  console.log('entering getPatientVitalsignsListByPatientId dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT * FROM ob.sc_vitalsigns WHERE patient_id = $1;
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
async function deletePatientVitalsigns(data) {
  console.log('entering deletePatientVitalsigns dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    DELETE FROM ob.sc_vitalsigns WHERE patient_id = $1 AND sc_vitalsigns_id	 = $2;`;
  const params = [data.patient_id, data.sc_vitalsigns_id];
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
async function getPatientCheckupHistoryByDate(schedule_checkup_id, date) {
  console.log('entering getPatientCheckupHistoryByDate dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT * FROM ob.sc_checkup_history WHERE last_edit_date::date = $1 AND schedule_checkup_id = $2;
  `;
  const params = [date, schedule_checkup_id];
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
async function isPatientDelivered(data) {
  console.log('entering isPatientDelivered dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    UPDATE ob.sc_checkup_history 
      SET delivered = $1 WHERE sc_checkup_history_id = $2
  `;
  const params = [data.is_delivered, data.sc_checkup_history_id];
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

exports.insertCheckupHistory = insertCheckupHistory;
exports.getPatientVitalsignsList = getPatientVitalsignsList;
exports.updatePatientVitalsigns = updatePatientVitalsigns;
exports.getPatientVitalsignsListByPatientId = getPatientVitalsignsListByPatientId;
exports.deletePatientVitalsigns = deletePatientVitalsigns;
exports.getPatientCheckupHistoryByDate = getPatientCheckupHistoryByDate;
exports.isPatientDelivered = isPatientDelivered;
exports.updateCheckupHistory = updateCheckupHistory;