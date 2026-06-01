const dbConnection = require('../connection/db_connetion');

/**
 *
 * @param {*} data
 */
async function insertPatientMedicine(data) {
  console.log('entering insertPatientMedicine dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection

  const queryText = `
      INSERT INTO ob.patient_medicine ( patient_id, medicine_id, med_qty ) VALUES ( $1 , $2 , $3 )
  `;
  const params = [data.patient_id, data.medicine_id, data.med_qty];
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
async function updatePatientMedicine(data) {
  console.log('entering updatePatientMedicine dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    UPDATE ob.patient_medicine SET 
      patient_id = $1,
      medicine_id = $2,
      med_qty = $3 
    WHERE patient_medicine_id = $4
  `;
  const params = [data.patient_id, data.medicine_id, data.med_qty, data.patient_medicine_id];

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


async function getPatientMedicineList(query) {
  console.log('entering getPatientMedicineList dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection

  let queryString = '';
  if(query){
    if(query.name) {
      queryString += ` name ILIKE '%${query.name}%' `;
    }
    if(query.page) {
      let limit = query.page * 10 - 10;
      queryString += ` LIMIT 10 OFFSET ${limit}`;
    }
    if(query.order) {
      queryString += ` ORDER BY name ${query.order} `;
    }
  }

  const queryText = `
    SELECT * FROM ob.patient_medicine ${queryString ? 'where': ''} ${queryString ? queryString: ''} 
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
 * @param {*} patientMedicineId
 */
async function getPatientMedicineInfoById(patientMedicineId) {
  console.log('entering getPatientMedicineInfoById dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection

  const queryText = `
    SELECT * FROM ob.patient_medicine WHERE patient_medicine_id = $1;
  `;
  const params = [patientMedicineId];
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
 * @param {*} patientMedicineId
 */
async function deletePatientMedicine(patientMedicineId) {
  console.log('entering deletePatientMedicine dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    DELETE FROM ob.patient_medicine WHERE patient_medicine_id = $1;`;
  const params = [patientMedicineId];
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
 * @param {*} patientId
 */
async function getPatientMedicineListByPatientId(patientId) {
  console.log('entering getPatientMedicineInfoById dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection

  const queryText = `
    SELECT * FROM ob.patient_medicine WHERE patient_id = $1;
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

exports.insertPatientMedicine = insertPatientMedicine;
exports.getPatientMedicineList = getPatientMedicineList;
exports.updatePatientMedicine = updatePatientMedicine;
exports.getPatientMedicineInfoById = getPatientMedicineInfoById;
exports.deletePatientMedicine = deletePatientMedicine;
exports.getPatientMedicineListByPatientId = getPatientMedicineListByPatientId;