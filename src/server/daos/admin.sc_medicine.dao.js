const dbConnection = require('../connection/db_connetion');

/**
 *
 * @param {*} data
 */
async function prescribedPatientMedicine(data) {
  console.log('entering prescribedPatientMedicines dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `

      INSERT INTO ob.sc_prescribed_medicine ( schedule_checkup_id, med_name, med_qty, frequency ) 
        VALUES ( $1, $2, $3, $4 )
  `;

  const params = [data.schedule_checkup_id, data.med_name, data.med_qty, data.frequency];
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
async function deletePrescribedPatientMedicineViaSCId(schedule_checkup_id) {
  console.log('entering deletePrescribedPatientMedicineViaSCId dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
      DELETE FROM ob.sc_prescribed_medicine
      WHERE schedule_checkup_id = $1
    `

  const params = [schedule_checkup_id];
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
 * @param {*} patient_id
 */
async function getPrescribeMedicine(patient_id) {
  console.log('entering getPrescribeMedicine dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT m.*
      FROM ob.medicine m
      INNER JOIN ob.sc_prescribed_medicine spm ON m.medicine_id = spm.medicine_id
      WHERE spm.schedule_checkup_id = (
          SELECT max(schedule_checkup_id)
          FROM ob.schedule_checkup
          WHERE patient_id = $1
          )
    `

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



/**
 *
 * @param {*} patient_id
 */
async function getPrescribeMedicineViaScheduleCheckupId(patient_id) {
  console.log('entering getPrescribeMedicineViaScheduleCheckupId dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    select * from ob.sc_prescribed_medicine where schedule_checkup_id = $1
    `

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

async function getPrescribeMedicineViaScheduleCheckupIds(patient_ids) {
  console.log('entering getPrescribeMedicineViaScheduleCheckupId dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    select * from ob.sc_prescribed_medicine where schedule_checkup_id = ANY($1)
    `

  const params = [patient_ids];
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

exports.prescribedPatientMedicine = prescribedPatientMedicine;
exports.deletePrescribedPatientMedicineViaSCId = deletePrescribedPatientMedicineViaSCId;
exports.getPrescribeMedicine = getPrescribeMedicine;
exports.getPrescribeMedicineViaScheduleCheckupId = getPrescribeMedicineViaScheduleCheckupId;
exports.getPrescribeMedicineViaScheduleCheckupIds = getPrescribeMedicineViaScheduleCheckupIds;
