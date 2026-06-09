const dbConnection = require('../connection/db_connetion');

/**
 *
 * @param {*} data
 */
async function insertPatient(data) {
  console.log('entering insertData dao');
  let poolConnection = await dbConnection.createPoolConnection(); // always start db connection

  const queryText = `

      INSERT INTO ob.patient ( patient_name, address, birth_date, contact_no, cs, philhealth, hmo ) 
        VALUES ( $1 , $2 , $3, $4, $5, $6, $7 ) RETURNING *
  `;
  const params = [
    data.patient_name,
    data.address,
    data.birth_date,
    data.contact_no,
    data.cs,
    data.philhealth,
    data.hmo
  ];
  try {
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}

/**
 *
 * @param {*} data
 */
async function updatePatient(data) {
  console.log('entering updatePatient dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    UPDATE ob.patient 
      SET patient_name = $1, address = $2, birth_date = $3, contact_no = $4, cs = $5, philhealth = $6, hmo = $7, last_edit_date = now() 
    WHERE patient_id = $8 
  `;
  const params = [
    data.patient_name,
    data.address,
    data.birth_date,
    data.contact_no,
    data.cs,
    data.philhealth,
    data.hmo,
    data.patient_id
  ];
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

async function getPatientList(query) {
  console.log('entering getPatientList dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  let i = 1;
  let params = [];
  let whereString = 'WHERE COALESCE(patient.is_deleted, false) = false';
  let orderString = 'ORDER BY patient.patient_name ASC';
  let pageString = '';
  let page = 1;
  let limit = 10;
  if (query) {
    if (query.name) {
      whereString += ` AND patient.patient_name ILIKE $${i++}`;
      params.push(`%${query.name}%`);
    }

    if (query.order) {
      if (query.order == 'asc') {
        orderString = `ORDER BY patient.patient_name ASC`;
      }

      if (query.order == 'desc') {
        orderString = `ORDER BY patient.patient_name DESC`;
      }
    }

    if (query.page) {
      page = Math.max(parseInt(query.page, 10) || 1, 1);
    }

    if (query.limit) {
      limit = Math.max(parseInt(query.limit, 10) || 10, 1);
    }
  }

  const offset = (page - 1) * limit;
  pageString = `LIMIT $${i++} OFFSET $${i++}`;
  params.push(limit, offset);

  const queryText = `
    SELECT patient.* FROM ob.patient AS patient ${whereString} ${orderString} ${pageString}
  `;

  const countParams = params.slice(0, params.length - 2);
  const countQueryText = `
    SELECT COUNT(*) FROM ob.patient AS patient ${whereString}
  `;

  try {
    const { rows } = await poolConnection.query(queryText, params);
    const countResult = await poolConnection.query(countQueryText, countParams);
    const total = parseInt(countResult.rows[0].count, 10);
    await poolConnection.end(); // always close db connection
    return {
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}

/**
 * @param {*} patientId
 */
async function getPatientInfoById(patientId) {
  console.log('entering getPatientInfoById dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT * FROM ob.patient WHERE patient_id = $1;
  `;
  const params = [patientId];
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
 * @param {*} patientId
 */
async function deletePatient(patientId, isDeleted) {
  console.log('entering deletePatient dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection

  const queryText = `
    UPDATE ob.patient 
      SET is_deleted = $1, last_edit_date = now() 
    WHERE patient_id = $2 `;
  const params = [isDeleted, patientId];
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

async function getTodaySchedulePatientList() {
  console.log('entering getTodaySchedulePatientList dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT 
      patient.*, 
      schedule_patient_status.value AS status,
      schedule_checkup.*
    FROM ob.schedule_checkup AS schedule_checkup
    LEFT JOIN ob.patient AS patient ON patient.patient_id = schedule_checkup.patient_id
    LEFT JOIN ob.look_up AS schedule_patient_status ON schedule_patient_status.look_up_id = schedule_checkup.status_id
    WHERE schedule_checkup.arrived_date::date = now()::date
      AND patient.is_deleted IS FALSE
      AND schedule_checkup.in_dashboard IS TRUE
    ORDER BY schedule_checkup.schedule_checkup_id
  `;

  try {
    const { rows } = await poolConnection.query(queryText);
    await poolConnection.end(); // always close db connection
    return rows;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}

async function isPatientScheduledToday(patientId) {
  console.log('entering isPatientScheduledToday dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    select * from ob.schedule_checkup where arrived_date::date = now()::date and patient_id = $1;
  `;
  const params = [patientId];
  try {
    const { rows } = await poolConnection.query(queryText, params);
    await poolConnection.end(); // always close db connection
    return rows.length > 0 ? rows : false;
  } catch (error) {
    console.log(error);
    await poolConnection.end(); // always close db connection
    return { err: error };
  }
}

async function deleteFile(patientTestResultsId) {
  console.log('entering deleteFile dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
      delete from ob.patient_test_results where google_id = $1 
  `;

  const params = [patientTestResultsId];

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

exports.insertPatient = insertPatient;
exports.getPatientList = getPatientList;
exports.updatePatient = updatePatient;
exports.getPatientInfoById = getPatientInfoById;
exports.deletePatient = deletePatient;
exports.getTodaySchedulePatientList = getTodaySchedulePatientList;
exports.isPatientScheduledToday = isPatientScheduledToday;
exports.deleteFile = deleteFile;
