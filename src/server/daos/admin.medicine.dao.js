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
  let whereString = 'WHERE is_deleted = false';
  let orderString = 'ORDER BY name ASC';
  let pageString = '';
  let page = 1;
  let limit = 10;
  if(query){
    if(query.name) {
      whereString += ` AND name ILIKE $${i++}`;
      params.push(`%${query.name}%`);
    }

    if(query.order) {

      if(query.order == 'asc'){
        orderString = `ORDER BY name ASC`;
      }

      if(query.order == 'desc'){
        orderString = `ORDER BY name DESC`;
      }

    }

    if(query.page) {
      page = Math.max(parseInt(query.page, 10) || 1, 1);
    }

    if(query.limit) {
      limit = Math.max(parseInt(query.limit, 10) || 10, 1);
    }
   
  }

  const offset = (page - 1) * limit;
  pageString = `LIMIT $${i++} OFFSET $${i++}`;
  params.push(limit, offset);

  const queryText = `
    SELECT * FROM ob.medicine ${whereString} ${orderString} ${pageString};
  `;

  const countParams = params.slice(0, params.length - 2);
  const countQueryText = `
    SELECT COUNT(*) FROM ob.medicine ${whereString};
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
