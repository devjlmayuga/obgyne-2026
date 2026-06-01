const dbConnection = require('../connection/db_connetion');

async function isExisting(patient_id) {
  console.log('entering isExisting dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT * FROM ob.patient_medical_history WHERE patient_id = $1;
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
 *
 * @param {*} data
 */
async function saveMedicalHistory(data) {
  console.log('entering saveMedicalHistory dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
      INSERT INTO ob.patient_medical_history ( 
        patient_id,
        remarks,
        allergies,
        asthma,
        dm,
        dm_remarks,
        hpn,
        hpn_remarks,
        others_remarks,
        mh_menarche,
        mh_interval,
        mh_duration,
        mh_ammount,
        mh_symptoms,
        sh_coitarche,
        sh_nop,
        sh_std,
        sh_vaccination,
        sh_others
       ) 
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19 )
  `;

  const params = [
    data.patient_id,
    data.remarks,
    data.allergies,
    data.asthma,
    data.dm,
    data.dm_remarks,
    data.hpn,
    data.hpn_remarks,
    data.others_remarks,
    data.mh_menarche,
    data.mh_interval,
    data.mh_duration,
    data.mh_ammount,
    data.mh_symptoms,
    data.sh_coitarche,
    data.sh_nop,
    data.sh_std,
    data.sh_vaccination,
    data.sh_others
  ];
  try {
    const { rows } = await poolConnection.query(queryText, params);
	console.log({rows});
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
async function updateMedicalHistory(data) {
  console.log('entering updateMedicalHistory dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    UPDATE ob.patient_medical_history SET 
      remarks = $1,
      allergies = $2,
      asthma = $3,
      dm = $4,
      dm_remarks = $5,
      hpn = $6,
      hpn_remarks = $7,
      others_remarks = $8,
      mh_menarche = $9,
      mh_interval = $10,
      mh_duration = $11,
      mh_ammount = $12,
      mh_symptoms = $13,
      sh_coitarche = $14,
      sh_nop = $15,
      sh_std = $16,
      sh_vaccination = $17,
      sh_others = $18,
      last_edit_date = now()
    WHERE patient_id = $19
  `;
  const params = [
    data.remarks,
    data.allergies,
    data.asthma,
    data.dm,
    data.dm_remarks,
    data.hpn,
    data.hpn_remarks,
    data.others_remarks,
    data.mh_menarche,
    data.mh_interval,
    data.mh_duration,
    data.mh_ammount,
    data.mh_symptoms,
    data.sh_coitarche,
    data.sh_nop,
    data.sh_std,
    data.sh_vaccination,
    data.sh_others,
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

async function getPatientConfinementList() {
  console.log('entering getPatientConfinementList dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
  SELECT po.*
	,(sch.lmp + interval '9months 7days') AS edc
	, sch.lmp
	, sch.sc_checkup_history_id
	, sch.delivered
FROM (
	SELECT p.patient_id
		,p.patient_name
		,MAX(sc.schedule_checkup_id) AS schedule_checkup_id
	FROM ob.patient p
	INNER JOIN ob.schedule_checkup sc ON p.patient_id = sc.patient_id
	INNER JOIN ob.sc_checkup_history sch ON sc.schedule_checkup_id = sch.schedule_checkup_id
	INNER JOIN ob.look_up lu ON sch.checkup_type_id = lu.look_up_id
	WHERE lu.look_up_type = 'checkupType'
		AND lu.value = 'Obstertics'
		AND now()::DATE >= (sch.lmp + interval '8months 7days')
	GROUP BY 1
	) po
INNER JOIN ob.sc_checkup_history sch ON po.schedule_checkup_id = sch.schedule_checkup_id
WHERE sch.delivered IS FALSE
ORDER BY 3 ASC;`;

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

async function getPatientMedicalHistory(patient_id) {
  console.log('entering getPatientMedicalHistory dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT * FROM ob.patient_medical_history WHERE patient_id = $1;
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

exports.isExisting = isExisting;
exports.saveMedicalHistory = saveMedicalHistory;
exports.updateMedicalHistory = updateMedicalHistory;
exports.getPatientConfinementList = getPatientConfinementList;
exports.getPatientMedicalHistory = getPatientMedicalHistory;
