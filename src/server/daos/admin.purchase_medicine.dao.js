const dbConnection = require('../connection/db_connetion');

/**
 *
 * @param {*} data
 */
async function purchasePatientMedicine(data) {
  console.log('entering purchasePatientMedicine dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `

      INSERT INTO ob.purchased_medicine ( schedule_checkup_id, medicine_id, qty ) 
        VALUES ( $1 , $2, $3 )
  `;

  const params = [data.schedule_checkup_id, data.medicine_id, data.qty];
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


async function getTotalSaleToday() {
  console.log('entering getTotalSaleToday dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    select
      pm.medicine_id,
      m.name,
      m.unit_price,
      sum(pm.qty) as qty,
      (sum(pm.qty) * m.unit_price) as total_amount
    from ob.purchased_medicine pm
    inner join ob.medicine m on pm.medicine_id = m.medicine_id
    where pm.last_edit_date::date = now()::date
    group by 1,2,3;
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


exports.purchasePatientMedicine = purchasePatientMedicine;
exports.getTotalSaleToday = getTotalSaleToday;