const dbConnection = require('../connection/db_connetion');

/**
 *
 * @param {*} data
 */
async function insertMedicine(data) {
  console.log('entering insertMedicine dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection

  const queryText = `
      INSERT INTO ob.medicine ( name, mg, qty, unit_price, description ) VALUES ( $1 , $2 , $3, $4, $5 )
  `;
  const params = [data.name, data.mg, data.qty, data.unit_price, data.description];
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
async function updateMedicine(data) {
  console.log('entering updateMedicine dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    UPDATE ob.medicine SET 
      name = $1,
      mg = $2,
      qty = $3, 
      unit_price = $4, 
      description = $5,
      last_edit_date = now()
    WHERE medicine_id = $6 
  `;
  const params = [data.name, data.mg, data.qty, data.unit_price, data.description, data.medicine_id];

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


async function getMedicineList(query) {
  console.log('entering getMedicineList dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  let i = 1;
  let params = [];
  let queryString = '';
  if(query){
    if(query.name) {
      queryString += `name ILIKE $${i++} `;
      params.push(`%${query.name}%`);
    }

    if(query.order) {

      if(query.order == 'asc'){
        queryString += ` ORDER BY name ASC`;
      }

      if(query.order == 'desc'){
        queryString += ` ORDER BY name DESC`;
      }

    }

    if(query.page) {
      let limit = query.page * 10 - 10;
      queryString += `LIMIT 10 OFFSET $${i++} `;
      params.push(limit);
    }
   
  }

  const queryText = `
    SELECT * FROM ob.medicine WHERE is_deleted = false ${query.name ? ' AND ': ''} ${queryString ? queryString: ''} ;
  `;

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
 * @param {*} medicineId
 */
async function getMedicineInfoById(medicineId) {
  console.log('entering getMedicineInfoById dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection

  const queryText = `
    SELECT * FROM ob.medicine WHERE medicine_id = $1;
  `;
  const params = [medicineId];
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
 * @param {*} medicineId
 */
async function deleteMedicine(medicineId) {
  console.log('entering deleteMedicine dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    UPDATE ob.medicine SET 
      is_deleted = true,
      last_edit_date = now()
    WHERE medicine_id = $1
  `;
  const params = [medicineId];
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
async function deductPurchasedMedicine(data) {
  console.log('entering deductPurchasedMedicine dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    UPDATE ob.medicine SET 
      qty = (SELECT qty FROM ob.medicine WHERE medicine_id = $1) - $2, 
      last_edit_date = now()
    WHERE medicine_id = $3 
  `;
  const params = [data.medicine_id, data.qty_to_deduct, data.medicine_id];

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
 * @param {*} medName
 */
async function isMedicineExising(medName) {
  console.log('entering isMedicineExising dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection

  const queryText = `
    SELECT * FROM ob.medicine WHERE name = $1 and is_deleted = false;
  `;
  const params = [medName];
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

exports.insertMedicine = insertMedicine;
exports.getMedicineList = getMedicineList;
exports.updateMedicine = updateMedicine;
exports.getMedicineInfoById = getMedicineInfoById;
exports.deleteMedicine = deleteMedicine;
exports.deductPurchasedMedicine = deductPurchasedMedicine;
exports.isMedicineExising = isMedicineExising;