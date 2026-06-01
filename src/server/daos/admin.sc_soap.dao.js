const dbConnection = require('../connection/db_connetion');




/**
 *
 * @param {*} data
 */
async function insertPatientSOAP(data) {
  console.log('entering insertPatientSOAP dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
      INSERT INTO ob.sc_soap ( 
        schedule_checkup_id,
        s_nausea_vomiting,
        s_nausea_vomiting_remarks,
        s_hypogastric_pain,
        s_hypogastric_pain_remarks,
        s_uterine_contractions,
        s_uterine_contractions_remarks,
        s_bleeding,
        s_bleeding_remarks,
        s_others,
        s_fetal_movement,
        s_fetal_movement_remarks,
        s_duration,
        s_intervention,
        o_fundic_height,
        o_fundic_height_remarks,
        o_fetal_heart_beat,
        o_fetal_heart_beat_remarks,
        o_others,
        o_others_remarks,
        o_abdomen,
        o_ie,
        o_se,
        o_breast,
        a_diagnosis,
        p_utz,
        p_blood,
        p_urine,
        p_others,
        p_vaccine_remarks,
        p_monitoring_remarks,
        s_what
        
       ) 
        VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32 )
  `;

  const params = [
      data.schedule_checkup_id,
      data.s_nausea_vomiting,
      data.s_nausea_vomiting_remarks,
      data.s_hypogastric_pain,
      data.s_hypogastric_pain_remarks,
      data.s_uterine_contractions,
      data.s_uterine_contractions_remarks,
      data.s_bleeding,
      data.s_bleeding_remarks,
      data.s_others,
      data.s_fetal_movement,
      data.s_fetal_movement_remarks,
      data.s_duration,
      data.s_intervention,
      data.o_fundic_height,
      data.o_fundic_height_remarks,
      data.o_fetal_heart_beat,
      data.o_fetal_heart_beat_remarks,
      data.o_others,
      data.o_others_remarks,
      data.o_abdomen,
      data.o_ie,
      data.o_se,
      data.o_breast,
      data.a_diagnosis,
      data.p_utz,
      data.p_blood,
      data.p_urine,
      data.p_others,
      data.p_vaccine_remarks,
      data.p_monitoring_remarks,
      data.s_what
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
async function updatePatientSOAP(data) {
  console.log('entering updatePatientSOAP dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
      UPDATE ob.sc_soap 
      SET
        schedule_checkup_id = $1,
        s_nausea_vomiting = $2,
        s_nausea_vomiting_remarks = $3,
        s_hypogastric_pain = $4,
        s_hypogastric_pain_remarks = $5,
        s_uterine_contractions = $6,
        s_uterine_contractions_remarks = $7,
        s_bleeding = $8,
        s_bleeding_remarks = $9,
        s_others = $10,
        s_fetal_movement = $11,
        s_fetal_movement_remarks = $12,
        s_duration = $13,
        s_intervention = $14,
        o_fundic_height = $15,
        o_fundic_height_remarks = $16,
        o_fetal_heart_beat = $17,
        o_fetal_heart_beat_remarks = $18,
        o_others = $19,
        o_others_remarks = $20,
        o_abdomen = $21,
        o_ie = $22,
        o_se = $23,
        o_breast = $24,
        a_diagnosis = $25,
        p_utz = $26,
        p_blood = $27,
        p_urine = $28,
        p_others = $29,
        p_vaccine_remarks = $30,
        p_monitoring_remarks = $31,
        s_what = $32,
        last_edit_date = now()
       
        WHERE sc_soap_id = $33
  `;
  
  const params = [
      data.schedule_checkup_id,
      data.s_nausea_vomiting,
      data.s_nausea_vomiting_remarks,
      data.s_hypogastric_pain,
      data.s_hypogastric_pain_remarks,
      data.s_uterine_contractions,
      data.s_uterine_contractions_remarks,
      data.s_bleeding,
      data.s_bleeding_remarks,
      data.s_others,
      data.s_fetal_movement,
      data.s_fetal_movement_remarks,
      data.s_duration,
      data.s_intervention,
      data.o_fundic_height,
      data.o_fundic_height_remarks,
      data.o_fetal_heart_beat,
      data.o_fetal_heart_beat_remarks,
      data.o_others,
      data.o_others_remarks,
      data.o_abdomen,
      data.o_ie,
      data.o_se,
      data.o_breast,
      data.a_diagnosis,
      data.p_utz,
      data.p_blood,
      data.p_urine,
      data.p_others,
      data.p_vaccine_remarks,
      data.p_monitoring_remarks,
      data.s_what,
      data.sc_soap_id
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
 * @param {*} date
 */
async function getPatientCheckupHistoryByDate(schedule_checkup_id, date) {
  console.log('entering getPatientCheckupHistoryByDate dao');
  const poolConnection = await dbConnection.createPoolConnection(); // always start db connection
  const queryText = `
    SELECT * FROM ob.sc_soap WHERE last_edit_date::date = $1 AND schedule_checkup_id = $2;
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

exports.insertPatientSOAP = insertPatientSOAP;
exports.getPatientCheckupHistoryByDate = getPatientCheckupHistoryByDate;
exports.updatePatientSOAP = updatePatientSOAP;