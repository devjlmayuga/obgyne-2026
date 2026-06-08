const dbConnection = require('../connection/db_connetion');

/**
 *
 * @param {*} data
 */
async function insertScheduleCheckup(data) {
  console.log('entering insertScheduleCheckup dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `

      INSERT INTO ob.schedule_checkup ( patient_id, status_id, in_dashboard ) 
        VALUES ( $1 , $2 , $3)  RETURNING *
  `;

  const params = [data.patient_id, data.status_id, data.in_dashboard];
  try {
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}

/**
 *
 * @param {*} data
 */
async function updateSchedulePatientStatus(data) {
  console.log('entering updateSchedulePatientStatus dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    UPDATE ob.schedule_checkup 
      SET status_id = $1, last_edit_date = now()
    WHERE schedule_checkup_id = $2
  `;
  const params = [data.status_id, data.schedule_checkup_id];
  try {
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}

/**
 *
 * @param {*} patient_id
 */
async function getPatientCheckupHistoryList(patient_id) {
  console.log('entering getPatientCheckupHistoryList dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT last_edit_date FROM ob.schedule_checkup
    WHERE patient_id = $1
  `;
  const params = [patient_id];
  try {
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}

/**
 * @param {*} patient_id
 */
async function isScheduledToday(patient_id) {
  console.log('entering isScheduledToday dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText =
    'SELECT * FROM ob.schedule_checkup WHERE patient_id = $1 AND last_edit_date::date = now()::date order by schedule_checkup_id desc';
  const params = [patient_id];
  try {
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}

/**
 *
 */
async function getCheckupHistoryViaScheduleCheckupId(scheduleCheckupId) {
  console.log('entering getCheckupHistoryViaScheduleCheckupId dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
   select * from ob.sc_checkup_history where schedule_checkup_id = $1
  `;
  const params = [scheduleCheckupId];
  try {
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}

/**
 *
 */
async function getPatientHistoryDateList(patientId, options = {}) {
  console.log('entering getPatientHistoryDateList dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const page = Math.max(parseInt(options.page, 10) || 1, 1);
  const limit = Math.max(parseInt(options.limit, 10) || 10, 1);
  const offset = (page - 1) * limit;
  const queryText = `
  select schedule_checkup_id, patient_id, to_char(last_edit_date, 'mm-dd-yyyy') AS checkup_date
    from ob.schedule_checkup where patient_id = $1
  order by schedule_checkup_id desc
  LIMIT $2 OFFSET $3
  `;
  const countQueryText = `
    SELECT COUNT(*) FROM ob.schedule_checkup WHERE patient_id = $1
  `;
  const params = [patientId, limit, offset];
  try {
    const { rows } = await poolConnection.query(queryText, params);
    const countResult = await poolConnection.query(countQueryText, [patientId]);
    const total = parseInt(countResult.rows[0].count, 10);
    await poolConnection.end(); // always close db connection
    return {
      data: rows,
      total,
      page,
      limit,
      hasMore: page * limit < total
    };
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}

/**
 *
 * @param {*} scheduleCheckupId
 */
async function getPatientSoapViaScheduleCheckupId(scheduleCheckupId) {
  console.log('entering getPatientSoapViaScheduleCheckupId dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    select * from ob.sc_soap where schedule_checkup_id = $1
  `;
  const params = [scheduleCheckupId];
  try {
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}


async function getCheckupHistoryViaScheduleCheckupIds(scheduleCheckupIds) {
  console.log('entering getCheckupHistoryViaScheduleCheckupIds dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
   select * from ob.sc_checkup_history where schedule_checkup_id = ANY($1)
  `;
  const params = [scheduleCheckupIds];
  try {
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}

/**
 *
 * @param {*} scheduleCheckupIds
 */
async function getPatientSoapViaScheduleCheckupIds(scheduleCheckupIds) {
  console.log('entering getPatientSoapViaScheduleCheckupId dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    select * from ob.sc_soap where schedule_checkup_id = ANY($1)
  `;
  const params = [scheduleCheckupIds];
  try {
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}


exports.insertScheduleCheckup = insertScheduleCheckup;
exports.updateSchedulePatientStatus = updateSchedulePatientStatus;
exports.getPatientCheckupHistoryList = getPatientCheckupHistoryList;
exports.isScheduledToday = isScheduledToday;
exports.getCheckupHistoryViaScheduleCheckupId = getCheckupHistoryViaScheduleCheckupId;
exports.getPatientHistoryDateList = getPatientHistoryDateList;
exports.getPatientSoapViaScheduleCheckupId = getPatientSoapViaScheduleCheckupId;
exports.getCheckupHistoryViaScheduleCheckupIds = getCheckupHistoryViaScheduleCheckupIds;
exports.getPatientSoapViaScheduleCheckupIds = getPatientSoapViaScheduleCheckupIds;
