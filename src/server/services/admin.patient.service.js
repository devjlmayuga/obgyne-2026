const Joi = require('joi');
const _ = require('underscore');
const fileUpload = require('cloudinary');
const { google } = require('googleapis');
const drive = google.drive('v3');
const path = require('path');
const fs = require('fs');

const patientDao = require('../daos/admin.patient.dao');
const scheduleCheckupDao = require('../daos/admin.schedule_checkup.dao');
const scMedicineDao = require('../daos/admin.sc_medicine.dao');
const scPurchaseMedicineDao = require('../daos/admin.purchase_medicine.dao');
const medicineDao = require('../daos/admin.medicine.dao');
const patientScheduleStatus = require('../configuration')
  .patient_schedule_status;
const patientMedicalHistory = require('../daos/admin.patient_medical_history.dao');
const scVitalsignsDao = require('../daos/admin.sc_vitalsigns.dao');
const scSAOPDao = require('../daos/admin.sc_soap.dao');
const scTestResultsDao = require('../daos/admin.sc_test_results.dao');
const patientDeliveryDao = require('../daos/admin.patient_delivery.dao');

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function insertPatient(data, res) {
  console.log('entering insertPatient service');

  const schema = Joi.object()
    .keys({
      patient_name: Joi.string()
        .allow('')
        .allow(null),
      address: Joi.string()
        .allow('')
        .allow(null),
      birth_date: Joi.date()
        .allow('')
        .allow(null),
      contact_no: Joi.string()
        .allow('')
        .allow(null),
      cs: Joi.string()
        .allow('')
        .allow(null),
      philhealth: Joi.string()
        .allow('')
        .allow(null),
      hmo: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await patientDao.insertPatient(data);

    if (response.err) {
      res.status(400).send(response.err);
    } else {
      res.status(200).send(response);
    }
  } else {
    res.status(400).send(validate.error.details);
  }
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function updatePatient(data, res) {
  console.log('entering insertPatient service');

  const schema = Joi.object()
    .keys({
      patient_id: Joi.number()
        .allow('')
        .allow(null),
      patient_name: Joi.string()
        .allow('')
        .allow(null),
      address: Joi.string()
        .allow('')
        .allow(null),
      birth_date: Joi.date()
        .allow('')
        .allow(null),
      contact_no: Joi.string()
        .allow('')
        .allow(null),
      cs: Joi.string()
        .allow('')
        .allow(null),
      philhealth: Joi.string()
        .allow('')
        .allow(null),
      hmo: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await patientDao.updatePatient(data);

    if (response.err) {
      res.status(400).send(response.err);
    } else {
      res.status(200).send('Patient successfully updated');
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
  res.status(200).send('Patient successfully updated');
}

async function getPatientList(query, res) {
  console.log('entering getPatientList service');
  const patientList = await patientDao.getPatientList(query);

  if (patientList.err) {
    res.status(400).send(patientList.err);
  } else {
    res.status(200).send(patientList);
  }
}

/**
 *
 * @param {*} patientId
 * @param {*} res
 */
async function getPatientInfoById(patientId, res) {
  console.log('entering getPatientInfoById service');

  const schema = Joi.object()
    .keys({
      patient_id: Joi.number()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate({ patient_id: patientId }, schema);
  if (validate.error == null) {
    const patientInfo = await patientDao.getPatientInfoById(patientId);

    if (patientInfo.err) {
      res.status(400).send(patientInfo.err);
    }

    const testResultRes = await scTestResultsDao.getTestResultViaPatientId(
      patientId
    );

    if (testResultRes.err) {
      res.status(400).send(testResultRes.err);
    }

    if (patientInfo.length > 0) {
      patientInfo[0].sc_test_results = testResultRes;
    }

    res.status(200).send(patientInfo);
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

/**
 *
 * @param {*} patientId
 * @param {*} res
 */
async function deletePatient(patientId, isDeleted, res) {
  console.log('entering deletePatient service');

  const schema = Joi.object()
    .keys({
      patient_id: Joi.number()
        .allow('')
        .allow(null),
      is_deleted: Joi.boolean()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(
    { patient_id: patientId, is_deleted: isDeleted },
    schema
  );

  if (validate.error == null) {
    const response = await patientDao.deletePatient(patientId, isDeleted);
    if (response.err) {
      res.status(400).send(response.err);
    } else {
      res.status(200).send('Patient successfully deleted');
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function insertTodayPatient(data, res) {
  console.log('entering insertTodayPatient service');

  let insertedId = null;
  let scheduledPatient = {};

  const schema = Joi.object()
    .keys({
      patient_id: Joi.number()
        .allow('')
        .allow(null),
      patient_name: Joi.string()
        .allow('')
        .allow(null),
      address: Joi.string()
        .allow('')
        .allow(null),
      birth_date: Joi.date()
        .allow('')
        .allow(null),
      contact_no: Joi.string()
        .allow('')
        .allow(null),
      cs: Joi.string()
        .allow('')
        .allow(null),
      philhealth: Joi.string()
        .allow('')
        .allow(null),
      hmo: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    if (!data.patient_id) {
      const insertedPatient = await patientDao.insertPatient(data);
      scheduledPatient = {
        patient_id: insertedPatient[0].patient_id,
        status_id: patientScheduleStatus.waiting
      };
    } else {
      scheduledPatient = {
        patient_id: data.patient_id,
        status_id: patientScheduleStatus.waiting
      };
    }

    insertedId = await scheduleCheckupDao.insertScheduleCheckup(
      scheduledPatient
    );

    if (insertedId.err) {
      res.status(400).send(insertedId.err);
    } else {
      res.status(200).send(insertedId);
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

async function getTodaySchedulePatientList(res) {
  console.log('entering getTodaySchedulePatientList service');
  const patientList = await patientDao.getTodaySchedulePatientList();
  if (patientList.err) {
    res.status(400).send(patientList.err);
  } else {
    res.status(200).send(patientList);
  }
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function prescribedPatientMedicine(data, res) {
  console.log('entering prescribedPatientMedicine service');

  const schema = Joi.object()
    .keys({
      schedule_checkup_id: Joi.number()
        .allow('')
        .allow(null),
      med_name: Joi.string()
        .allow('')
        .allow(null),
      med_qty: Joi.number()
        .allow('')
        .allow(null),
      frequency: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  _.forEach(data, med => {
    const validate = Joi.validate(med, schema);
    if (validate.error != null) {
      res.status(400).send(validate.error.details);
    }
  });

  _.forEach(data, async med => {
    const response = await scMedicineDao.prescribedPatientMedicine(med);

    if (response.err) {
      res.status(200).send(response.err);
    }
  });

  res.status(200).send('Prescribed medicine successfully added');
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function purchasePatientMedicine(data, res) {
  console.log('entering purchasePatientMedicine service');
  let notEnoughStocks = false;
  let completed = 0;
  let completedChecking = 0;
  let availableStocks = [];

  const schema = Joi.object()
    .keys({
      schedule_checkup_id: Joi.number()
        .allow('')
        .allow(null),
      medicine_id: Joi.number()
        .allow('')
        .allow(null),
      qty: Joi.number()
        .allow('')
        .allow(null),
      name: Joi.string()
        .allow('')
        .allow(null),
      unit_price: Joi.number()
        .allow('')
        .allow(null),
      total_price: Joi.number()
        .allow('')
        .allow(null)
    })
    .unknown();

  _.forEach(data, med => {
    const validate = Joi.validate(med, schema);
    if (validate.error != null) {
      res.status(400).send(validate.error.details);
    }
  });

  _.forEach(data, async med => {
    const currentMedStatus = await medicineDao.getMedicineInfoById(
      med.medicine_id
    );

    if (currentMedStatus[0].qty < med.qty) {
      notEnoughStocks = true;
      availableStocks.push(currentMedStatus[0]);
    }

    completedChecking++;
  });

  const checker = setInterval(function() {
    if (completed === data.length) {
      clearInterval(checker);
      res.send('Purchase medicine successfully added');
    }
  }, 1000);

  const checkerStocks = setInterval(function() {
    if (completedChecking === data.length) {
      clearInterval(checkerStocks);
      if (availableStocks.length > 0) {
        res.status(400).send({ err: availableStocks });
      } else {
        _.forEach(data, async med => {
          const deductMed = {
            qty_to_deduct: med.qty,
            medicine_id: med.medicine_id
          };

          const purchaseMedRes = await scPurchaseMedicineDao.purchasePatientMedicine(
            med
          );

          if (purchaseMedRes.err) {
            res.status(400).send(purchaseMedRes.err);
          }

          const deductRes = await medicineDao.deductPurchasedMedicine(
            deductMed
          );

          if (deductRes.err) {
            res.status(400).send(deductRes.err);
          }

          completed++;
        });
      }
    }
  }, 1000);
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function updateSchedulePatientStatus(data, res) {
  console.log('entering updateSchedulePatientStatus service');

  const schema = Joi.object()
    .keys({
      schedule_checkup_id: Joi.number()
        .allow('')
        .allow(null),
      status_id: Joi.number()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await scheduleCheckupDao.updateSchedulePatientStatus(data);

    if (response.err) {
      res.status(400).send(response.err);
    } else {
      res.status(200).send('Scheduled patient status successfully updated');
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

/**
 *
 * @param {*} patientId
 * @param {*} res
 */
async function getPatientCheckupHistoryList(patientId, res) {
  console.log('entering getPatientCheckupHistoryList service');

  const schema = Joi.object()
    .keys({
      patient_id: Joi.number()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate({ patient_id: patientId }, schema);
  let checkupHistoryList = null;
  if (validate.error == null) {
    checkupHistoryList = await scheduleCheckupDao.getPatientCheckupHistoryList(
      patientId
    );

    if (checkupHistoryList.err) {
      res.status(400).send(checkupHistoryList.err);
    } else {
      res.status(200).send(checkupHistoryList);
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

/**
 *
 * @param {*} date
 * @param {*} res
 */
async function getPatientCheckupHistoryByDate(scheduleCheckupId, date, res) {
  console.log('entering getPatientCheckupHistoryByDate service');

  const schema = Joi.object()
    .keys({
      schedule_checkup_id: Joi.number()
        .allow('')
        .allow(null),
      date: Joi.date()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(
    { date, schedule_checkup_id: scheduleCheckupId },
    schema
  );
  let vitalsigns = null;
  let soap = null;
  let testResult = null;
  const history = [];
  if (validate.error == null) {
    vitalsigns = await scVitalsignsDao.getPatientCheckupHistoryByDate(
      scheduleCheckupId,
      date
    );

    if (vitalsigns.err) {
      res.status(400).send(vitalsigns.err);
    }

    soap = await scSAOPDao.getPatientCheckupHistoryByDate(
      scheduleCheckupId,
      date
    );

    if (soap.err) {
      res.status(400).send(vitalsigns.err);
    }

    testResult = await scTestResultsDao.getPatientTestResultByDate(
      scheduleCheckupId,
      date
    );

    if (testResult.err) {
      res.status(400).send(testResult.err);
    }

    history.push({ vitalsigns });
    history.push({ soap });
    history.push({ testResult });
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
  res.status(200).send(history);
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function subSaveMedicalHistory(data, res) {
  console.log(data);
  const schema = Joi.object()
    .keys({
      patient_id: Joi.number()
        .allow('')
        .allow(null),
      remarks: Joi.string()
        .allow('')
        .allow(null),
      allergies: Joi.string()
        .allow('')
        .allow(null),
      asthma: Joi.string()
        .allow('')
        .allow(null),
      dm: Joi.boolean()
        .allow('')
        .allow(null),
      dm_remarks: Joi.string()
        .allow('')
        .allow(null),
      hpn: Joi.boolean()
        .allow('')
        .allow(null),
      hpn_remarks: Joi.string()
        .allow('')
        .allow(null),
      others_remarks: Joi.string()
        .allow('')
        .allow(null),
      // ob_score: Joi.string().allow('').allow(null),
      // lmp: Joi.date().allow('').allow(null),
      // aog_weeks: Joi.string().allow('').allow(null),
      // aog_days: Joi.string().allow('').allow(null)

      // checkup_type_id: Joi.number().allow('').allow(null),
      mh_menarche: Joi.string()
        .allow('')
        .allow(null),
      mh_interval: Joi.string()
        .allow('')
        .allow(null),
      mh_duration: Joi.string()
        .allow('')
        .allow(null),
      mh_ammount: Joi.string()
        .allow('')
        .allow(null),
      mh_symptoms: Joi.string()
        .allow('')
        .allow(null),
      sh_coitarche: Joi.string()
        .allow('')
        .allow(null),
      sh_nop: Joi.string()
        .allow('')
        .allow(null),
      sh_std: Joi.string()
        .allow('')
        .allow(null),
      sh_vaccination: Joi.string()
        .allow('')
        .allow(null),
      sh_others: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = patientMedicalHistory.saveMedicalHistory(data);

    if (response.err) {
      res.status(400).send(response.err);
    }
  } else {
    res.status(400).send(validate.error.details);
  }
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function subUpdateMedicalHistory(data, res) {
  const schema = Joi.object()
    .keys({
      patient_id: Joi.number()
        .allow('')
        .allow(null),
      remarks: Joi.string()
        .allow('')
        .allow(null),
      allergies: Joi.string()
        .allow('')
        .allow(null),
      asthma: Joi.string()
        .allow('')
        .allow(null),
      dm: Joi.boolean()
        .allow('')
        .allow(null),
      dm_remarks: Joi.string()
        .allow('')
        .allow(null),
      hpn: Joi.boolean()
        .allow('')
        .allow(null),
      hpn_remarks: Joi.string()
        .allow('')
        .allow(null),
      others_remarks: Joi.string()
        .allow('')
        .allow(null)
      // ob_score: Joi.string().allow('').allow(null),
      // lmp: Joi.date().allow('').allow(null),
      // aog_weeks: Joi.string().allow('').allow(null),
      // aog_days: Joi.string().allow('').allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await patientMedicalHistory.updateMedicalHistory(data);

    if (response.err) {
      res.status(400).send(response.err);
    }
  } else {
    res.status(400).send(validate.error.details);
  }
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function subSaveCheckupHistory(data, res) {
  const schema = Joi.object()
    .keys({
      schedule_checkup_id: Joi.number()
        .allow('')
        .allow(null),
      //MH/SH HISTORY
      checkup_type_id: Joi.number()
        .allow('')
        .allow(null),
      mh_menarche: Joi.string()
        .allow('')
        .allow(null),
      mh_interval: Joi.string()
        .allow('')
        .allow(null),
      mh_duration: Joi.string()
        .allow('')
        .allow(null),
      mh_ammount: Joi.string()
        .allow('')
        .allow(null),
      mh_symptoms: Joi.string()
        .allow('')
        .allow(null),
      sh_coitarche: Joi.string()
        .allow('')
        .allow(null),
      sh_nop: Joi.string()
        .allow('')
        .allow(null),
      sh_std: Joi.string()
        .allow('')
        .allow(null),
      sh_vaccination: Joi.string()
        .allow('')
        .allow(null),
      sh_others: Joi.string()
        .allow('')
        .allow(null),
      //AOG
      aog_date: Joi.date()
        .allow('')
        .allow(null),
      aog_remarks: Joi.string()
        .allow('')
        .allow(null),
      aog_by_utz: Joi.string()
        .allow('')
        .allow(null),

      //VITAL SIGNS
      weight: Joi.string()
        .allow('')
        .allow(null),
      bp: Joi.string()
        .allow('')
        .allow(null),
      cr: Joi.string()
        .allow('')
        .allow(null),
      temp: Joi.string()
        .allow('')
        .allow(null),
      remarks: Joi.string()
        .allow('')
        .allow(null),

      ob_score: Joi.string()
        .allow('')
        .allow(null),
      lmp: Joi.date()
        .allow('')
        .allow(null),
      aog_weeks: Joi.string()
        .allow('')
        .allow(null),
      aog_days: Joi.string()
        .allow('')
        .allow(null),
      extra_ob_score: Joi.string()
        .allow('')
        .allow(null),
      extra_lmp: Joi.date()
        .allow('')
        .allow(null),
      aog_by_lmp: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await scVitalsignsDao.insertCheckupHistory(data);

    if (response.err) {
      res.status(400).send(response.err);
    }
  } else {
    res.status(400).send(validate.error.details);
  }
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function subUpdateCheckupHistory(data, res) {
  const schema = Joi.object()
    .keys({
      sc_checkup_history_id: Joi.number()
        .allow('')
        .allow(null),
      schedule_checkup_id: Joi.number()
        .allow('')
        .allow(null),
      //MH/SH HISTORY
      checkup_type_id: Joi.number().required(),
      mh_menarche: Joi.string()
        .allow('')
        .allow(null),
      mh_interval: Joi.string()
        .allow('')
        .allow(null),
      mh_duration: Joi.string()
        .allow('')
        .allow(null),
      mh_ammount: Joi.string()
        .allow('')
        .allow(null),
      mh_symptoms: Joi.string()
        .allow('')
        .allow(null),
      sh_coitarche: Joi.string()
        .allow('')
        .allow(null),
      sh_nop: Joi.string()
        .allow('')
        .allow(null),
      sh_std: Joi.string()
        .allow('')
        .allow(null),
      sh_vaccination: Joi.string()
        .allow('')
        .allow(null),
      sh_others: Joi.string()
        .allow('')
        .allow(null),
      //AOG
      aog_date: Joi.date()
        .allow('')
        .allow(null),
      aog_remarks: Joi.string()
        .allow('')
        .allow(null),
      aog_by_utz: Joi.string()
        .allow('')
        .allow(null),
      aog_by_lmp: Joi.string()
        .allow('')
        .allow(null),

      //VITAL SIGNS
      weight: Joi.string()
        .allow('')
        .allow(null),
      bp: Joi.string()
        .allow('')
        .allow(null),
      cr: Joi.string()
        .allow('')
        .allow(null),
      temp: Joi.string()
        .allow('')
        .allow(null),
      remarks: Joi.string()
        .allow('')
        .allow(null),

      ob_score: Joi.string()
        .allow('')
        .allow(null),
      lmp: Joi.date()
        .allow('')
        .allow(null),
      aog_weeks: Joi.string()
        .allow('')
        .allow(null),
      aog_days: Joi.string()
        .allow('')
        .allow(null),
      extra_ob_score: Joi.string()
        .allow('')
        .allow(null),
      extra_lmp: Joi.date()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await scVitalsignsDao.updateCheckupHistory(data);

    if (response.err) {
      res.status(400).send(response.err);
    }
  } else {
    res.status(400).send(validate.error.details);
  }
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function subSaveSoap(data, res) {
  const schema = Joi.object()
    .keys({
      schedule_checkup_id: Joi.number()
        .allow('')
        .allow(null),
      s_nausea_vomiting: Joi.boolean()
        .allow('')
        .allow(null),
      s_nausea_vomiting_remarks: Joi.string()
        .allow('')
        .allow(null),
      s_hypogastric_pain: Joi.boolean()
        .allow('')
        .allow(null),
      s_hypogastric_pain_remarks: Joi.string()
        .allow('')
        .allow(null),
      s_uterine_contractions: Joi.boolean()
        .allow('')
        .allow(null),
      s_uterine_contractions_remarks: Joi.string()
        .allow('')
        .allow(null),
      s_bleeding: Joi.boolean()
        .allow('')
        .allow(null),
      s_bleeding_remarks: Joi.string()
        .allow('')
        .allow(null),
      s_others: Joi.string()
        .allow('')
        .allow(null),
      s_fetal_movement: Joi.boolean()
        .allow('')
        .allow(null),
      s_fetal_movement_remarks: Joi.string()
        .allow('')
        .allow(null),
      s_what: Joi.string()
        .allow('')
        .allow(null),
      s_duration: Joi.string()
        .allow('')
        .allow(null),
      s_intervention: Joi.string()
        .allow('')
        .allow(null),
      o_fundic_height: Joi.string()
        .allow('')
        .allow(null),
      o_fundic_height_remarks: Joi.string()
        .allow('')
        .allow(null),
      o_fetal_heart_beat: Joi.string()
        .allow('')
        .allow(null),
      o_fetal_heart_beat_remarks: Joi.string()
        .allow('')
        .allow(null),
      o_others: Joi.string()
        .allow('')
        .allow(null),
      o_others_remarks: Joi.string()
        .allow('')
        .allow(null),
      o_abdomen: Joi.string()
        .allow('')
        .allow(null),
      o_ie: Joi.string()
        .allow('')
        .allow(null),
      o_se: Joi.string()
        .allow('')
        .allow(null),
      o_breast: Joi.string()
        .allow('')
        .allow(null),
      a_diagnosis: Joi.string()
        .allow('')
        .allow(null),
      p_utz: Joi.string()
        .allow('')
        .allow(null),
      p_blood: Joi.string()
        .allow('')
        .allow(null),
      p_urine: Joi.string()
        .allow('')
        .allow(null),
      p_others: Joi.string()
        .allow('')
        .allow(null),
      p_vaccine_remarks: Joi.string()
        .allow('')
        .allow(null),
      p_monitoring_remarks: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await scSAOPDao.insertPatientSOAP(data);

    if (response.err) {
      res.status(400).send(response.err);
    }
  } else {
    res.status(400).send(validate.error.details);
  }
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function subUpdateSoap(data, res) {
  const schema = Joi.object()
    .keys({
      sc_soap_id: Joi.number().required(),
      schedule_checkup_id: Joi.number()
        .allow('')
        .allow(null),
      s_nausea_vomiting: Joi.boolean()
        .allow('')
        .allow(null),
      s_nausea_vomiting_remarks: Joi.string()
        .allow('')
        .allow(null),
      s_hypogastric_pain: Joi.boolean()
        .allow('')
        .allow(null),
      s_hypogastric_pain_remarks: Joi.string()
        .allow('')
        .allow(null),
      s_uterine_contractions: Joi.boolean()
        .allow('')
        .allow(null),
      s_uterine_contractions_remarks: Joi.string()
        .allow('')
        .allow(null),
      s_bleeding: Joi.boolean()
        .allow('')
        .allow(null),
      s_bleeding_remarks: Joi.string()
        .allow('')
        .allow(null),
      s_others: Joi.string()
        .allow('')
        .allow(null),
      s_fetal_movement: Joi.boolean()
        .allow('')
        .allow(null),
      s_fetal_movement_remarks: Joi.string()
        .allow('')
        .allow(null),
      s_duration: Joi.string()
        .allow('')
        .allow(null),
      s_intervention: Joi.string()
        .allow('')
        .allow(null),
      s_what: Joi.string()
        .allow('')
        .allow(null),
      o_fundic_height: Joi.string()
        .allow('')
        .allow(null),
      o_fundic_height_remarks: Joi.string()
        .allow('')
        .allow(null),
      o_fetal_heart_beat: Joi.string()
        .allow('')
        .allow(null),
      o_fetal_heart_beat_remarks: Joi.string()
        .allow('')
        .allow(null),
      o_others: Joi.string()
        .allow('')
        .allow(null),
      o_others_remarks: Joi.string()
        .allow('')
        .allow(null),
      o_abdomen: Joi.string()
        .allow('')
        .allow(null),
      o_ie: Joi.string()
        .allow('')
        .allow(null),
      o_se: Joi.string()
        .allow('')
        .allow(null),
      o_breast: Joi.string()
        .allow('')
        .allow(null),
      a_diagnosis: Joi.string()
        .allow('')
        .allow(null),
      p_utz: Joi.string()
        .allow('')
        .allow(null),
      p_blood: Joi.string()
        .allow('')
        .allow(null),
      p_urine: Joi.string()
        .allow('')
        .allow(null),
      p_others: Joi.string()
        .allow('')
        .allow(null),
      p_vaccine_remarks: Joi.string()
        .allow('')
        .allow(null),
      p_monitoring_remarks: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await scSAOPDao.updatePatientSOAP(data);

    if (response.err) {
      res.status(400).send(response.err);
    }
  } else {
    res.status(400).send(validate.error.details);
  }
}
/**
 *
 * @param {*} data
 * @param {*} res
 */
async function subPrescribedPatientMedicine(data, res) {
  console.log('entering subPrescribedPatientMedicine service');

  const schema = Joi.object()
    .keys({
      schedule_checkup_id: Joi.number()
        .allow('')
        .allow(null),
      med_name: Joi.string()
        .allow('')
        .allow(null),
      med_qty: Joi.number()
        .allow('')
        .allow(null),
      frequency: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  _.forEach(data, med => {
    const validate = Joi.validate(med, schema);
    if (validate.error != null) {
      res.status(400).send(validate.error.details);
    }
  });

  _.forEach(data, async med => {
    const response = await scMedicineDao.prescribedPatientMedicine(med);

    if (response.err) {
      res.status(400).send(response.err);
    }
  });
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function savePatientCheckup(data, res) {
  console.log(data.prescribed_medicine);
  console.log(data.sc_checkup_history);
  console.log(data.sc_soap);

  let schedule_checkup_id = 0;

  if (data.prescribed_medicine && data.prescribed_medicine.length > 0) {
    schedule_checkup_id = data.prescribed_medicine[0].schedule_checkup_id;
  } else if (data.sc_checkup_history) {
    schedule_checkup_id = data.sc_checkup_history.schedule_checkup_id;
  } else if (data.sc_soap) {
    schedule_checkup_id = data.sc_soap.schedule_checkup_id;
  }

  if (data.prescribed_medicine) {
    await subPrescribedPatientMedicine(data.prescribed_medicine, res);
  }

  if (!data.sc_checkup_history) {
    let sc_checkup_history = {
      schedule_checkup_id
    };

    data.sc_checkup_history = sc_checkup_history;
  }

  await subSaveCheckupHistory(data.sc_checkup_history, res);

  if (!data.sc_soap) {
    let sc_soap = {
      schedule_checkup_id
    };
    data.sc_soap = sc_soap;
  }

  await subSaveSoap(data.sc_soap, res);

  res.status(200).send('Patient Checkup History Successfully Saved');
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function updatePatientCheckup(data, res) {
  console.log(data.prescribed_medicine);
  console.log(data.sc_checkup_history);
  console.log(data.sc_soap);

  if (data.prescribed_medicine && data.prescribed_medicine.length > 0) {
    await subUpdatePrescribedPatientMedicine(data.prescribed_medicine, res);
  }

  if (data.sc_checkup_history) {
    await subUpdateCheckupHistory(data.sc_checkup_history, res);
  }

  if (data.sc_soap) {
    await subUpdateSoap(data.sc_soap, res);
  }

  res.status(200).send('Patient Checkup History Successfully Updated');
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function subUpdatePrescribedPatientMedicine(data, res) {
  console.log('entering updatePrescribedPatientMedicine service');

  await scMedicineDao.deletePrescribedPatientMedicineViaSCId(
    data[0].schedule_checkup_id
  );

  const schema = Joi.object()
    .keys({
      schedule_checkup_id: Joi.number()
        .allow('')
        .allow(null),
      med_name: Joi.string()
        .allow('')
        .allow(null),
      med_qty: Joi.number()
        .allow('')
        .allow(null),
      frequency: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  _.forEach(data, med => {
    const validate = Joi.validate(med, schema);
    if (validate.error != null) {
      res.status(400).send(validate.error.details);
    }
  });

  _.forEach(data, async med => {
    const response = await scMedicineDao.prescribedPatientMedicine(med);

    if (response.err) {
      res.status(400).send(response.err);
    }
  });
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function saveFilePath(updaload_file_id, data, res) {
  const toBeSave = {
    patient_id: data.patient_id,
    test_type: data.test_type,
    file_path: `https://drive.google.com/open?id=${updaload_file_id}`,
    google_id: updaload_file_id
  };

  const schema = Joi.object()
    .keys({
      test_type: Joi.string()
        .allow('')
        .allow(null),
      patient_id: Joi.number()
        .allow('')
        .allow(null),
      file_path: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(toBeSave, schema);

  if (validate.error == null) {
    const response = await scTestResultsDao.saveTestResults(toBeSave);

    if (response.err) {
      res.status(400).send(response.err);
    } else {
      res.status(200).send(response);
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

async function googleDriveAuth() {
  const clientEmail = process.env.GOOGLE_DRIVE_CLIENT_EMAIL;
  const privateKeyRaw = process.env.GOOGLE_DRIVE_PRIVATE_KEY;

  if (!clientEmail || !privateKeyRaw) {
    throw new Error(
      'Missing Google Drive credentials. Set GOOGLE_DRIVE_CLIENT_EMAIL and GOOGLE_DRIVE_PRIVATE_KEY in your environment.'
    );
  }

  const privateKey = privateKeyRaw.replace(/\\n/g, '\n');

  const jwtoken = new google.auth.JWT(
    clientEmail,
    null,
    privateKey,
    ['https://www.googleapis.com/auth/drive.file'],
    null
  );

  jwtoken.authorize(auhtErr => {
    if (auhtErr) {
      console.log('error : ' + auhtErr);
      return;
    } else {
      console.log('Authorization accorded');
    }
  });

  return jwtoken;
}

async function googleDriveCreateFolder(data, res) {
  const jwtClient = await googleDriveAuth();
  const parents = '1FYuLbNPOY5CvaZohuTnsUEPRCQ4iUMTy';

  var fileMetadata = {
    name: 'Invoices',
    parents: parents,
    mimeType: 'application/vnd.google-apps.folder'
  };
  drive.files.create(
    {
      auth: jwtClient,
      resource: fileMetadata,
      fields: 'id'
    },
    function(err, file) {
      if (err) {
        // Handle error
        console.error(err);
      } else {
        console.log('Folder Id: ', file.data.id);
        return file.data;
      }
    }
  );
}

async function googleDriveListAllFiles(res) {
  const jwtClient = await googleDriveAuth();
  const parents = '1FYuLbNPOY5CvaZohuTnsUEPRCQ4iUMTy';

  drive.files.list(
    {
      auth: jwtClient,
      pageSize: 10,
      q: "'" + parents + "' in parents and trashed=false",
      fields: 'files(id, name)'
    },
    (err, { data }) => {
      if (err) return console.log('The API returned an error: ' + err);
      const files = data.files;
      if (files.length) {
        console.log('Files:');
        files.map(file => {
          console.log(`${file.name} (${file.id})`);
        });
        res.status(200).send(files);

        return files;
      } else {
        console.log('No files found.');
      }
    }
  );
}

async function googleDriveUploadFile(file, data, res) {
  const jwtClient = await googleDriveAuth();
  // upload file in specific folder
  const folderId = '1FYuLbNPOY5CvaZohuTnsUEPRCQ4iUMTy';
  const fileMetadata = {
    name: `patient_${data.patient_id}_${file.originalname}`,
    parents: [folderId]
  };
  const media = {
    mimeType: file.mimetype,
    body: fs.createReadStream(path.join(file.path))
  };
  drive.files.create(
    {
      auth: jwtClient,
      resource: fileMetadata,
      media: media,
      fields: 'id'
    },
    async function(err, file) {
      if (err) {
        // Handle error
        console.error(err);
        res.status(400).send(err);
      } else {
        console.log('File Id: ', file.data.id);
        saveFilePath(file.data.id, data, res);
      }
    }
  );
}

/**
 *
 * @param {*} res
 */
async function getPatientConfinementList(res) {
  console.log('entering getPatientConfinementList service');

  const patientConfinementList = await patientMedicalHistory.getPatientConfinementList();

  if (patientConfinementList.err) {
    res.status(400).send(patientConfinementList.err);
  } else {
    res.status(200).send(patientConfinementList);
  }
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function saveMedicalHistory(data, res) {
  const isExisting = await patientMedicalHistory.isExisting(
    data.medical_history.patient_id
  );

 console.log({isExisting});
  if (isExisting.length == 0) {
    await subSaveMedicalHistory(data.medical_history, res);
  } else {
    await subUpdateMedicalHistory(data.medical_history, res);
  }

  // save patient delivery
  if (data.patient_delivery) {
    await subSavePatientDelivery(data.patient_delivery, res);
  }
  res.status(200).send('Save Medical History');
}

async function subSavePatientDelivery(data, res) {
  const schema = Joi.object()
    .keys({
      patient_id: Joi.number()
        .allow('')
        .allow(null),
      year: Joi.string()
        .allow('')
        .allow(null),
      mode_of_delivery: Joi.string()
        .allow('')
        .allow(null),
      place_of_delivery: Joi.string()
        .allow('')
        .allow(null),
      attendant: Joi.string()
        .allow('')
        .allow(null),
      complications: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  _.forEach(data, del => {
    const validate = Joi.validate(del, schema);
    if (validate.error != null) {
      res.status(400).send(validate.error.details);
    }
  });

  _.forEach(data, async del => {
    await patientDeliveryDao.deletePatientDelivery(del.patient_id);

    let response = await patientDeliveryDao.insertPatientDelivery(del);

    if (response.err) {
      res.status(400).send(response.err);
    }
  });
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function updatePrescribedPatientMedicine(data, schedule_checkup_id, res) {
  console.log('entering updatePrescribedPatientMedicine service');

  await scMedicineDao.deletePrescribedPatientMedicineViaSCId(
    schedule_checkup_id
  );

  const schema = Joi.object()
    .keys({
      schedule_checkup_id: Joi.number()
        .allow('')
        .allow(null),
      medicine_id: Joi.number()
        .allow('')
        .allow(null),
      med_qty: Joi.number()
        .allow('')
        .allow(null),
      frequency: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  _.forEach(data, med => {
    const validate = Joi.validate(med, schema);
    if (validate.error != null) {
      res.status(400).send(validate.error.details);
    }
  });

  _.forEach(data, async med => {
    const response = await scMedicineDao.prescribedPatientMedicine(med);

    if (response.err) {
      res.status(400).send(response.err);
    }
  });

  res.status(200).send('Prescribed medicine successfully updated');
}

/**
 *
 * @param {*} res
 */
async function getPatientMedicalHistory(patient_id, res) {
  console.log('entering getPatientMedicalHistory service');

  const response = await patientMedicalHistory.getPatientMedicalHistory(
    patient_id
  );

  if (response.err) {
    res.status(400).send(response.err);
  } else {
    res.status(200).send(response);
  }
}

/**
 *
 * @param {*} res
 */
async function getPrescribeMedicine(patient_id, res) {
  console.log('entering getPrescribeMedicine service');

  const response = await scMedicineDao.getPrescribeMedicine(patient_id);

  if (response.err) {
    res.status(400).send(response.err);
  } else {
    res.status(200).send(response);
  }
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function schedulePatient(data, res) {
  console.log('entering schedulePatient service');
  const schema = Joi.object()
    .keys({
      patient_id: Joi.number().required(),
      status_id: Joi.number().required()
    })
    .unknown();
  const validate = Joi.validate(data, schema);
  if (validate.error == null) {
    const isExist = await scheduleCheckupDao.isScheduledToday(data.patient_id);
    if (isExist.length > 0) {
      res.status(200).send(isExist);
      return;
    }
    const response = await scheduleCheckupDao.insertScheduleCheckup(data);
    if (response.err) {
      res.status(400).send(response.err);
    } else {
      res.status(200).send(response);
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

/**
 *
 * @param {*} res
 */
async function getPatientTestResultByScheduleCheckupId(scheduleCheckupId, res) {
  console.log('entering getPatientTestResultByScheduleCheckupId service');

  const response = await scTestResultsDao.getPatientTestResultByScheduleCheckupId(
    scheduleCheckupId
  );

  if (response.err) {
    res.status(400).send(response.err);
  } else {
    res.status(200).send(response);
  }
}

/**
 *
 * @param {*} res
 */
async function getPatientTestResultByPatientId(partientId, res) {
  console.log('entering getPatientTestResultByPatientId service');

  const response = await scTestResultsDao.getPatientTestResultByPatientId(
    partientId
  );

  if (response.err) {
    res.status(400).send(response.err);
  } else {
    res.status(200).send(response);
  }
}

async function isPatientDelivered(sc_checkup_history_id, is_delivered, res) {
  console.log('entering isPatientDelivered service');

  const data = {
    is_delivered: is_delivered,
    sc_checkup_history_id: sc_checkup_history_id
  };

  const response = await scVitalsignsDao.isPatientDelivered(data);

  if (response.err) {
    res.status(400).send(response.err);
  } else {
    res.status(200).send(`Delivered Updated to ${is_delivered}`);
  }
}

/**
 *
 * @param {*} res
 */
async function getPatientCheckupHistoryBackup(patientId, res) {
  console.log('entering getPatientCheckupHistory service');
  let completed = 0;
  let finalResponse = [];

  const patientHistoryDateRes = await scheduleCheckupDao.getPatientHistoryDateList(
    patientId
  );

  if (patientHistoryDateRes.err) {
    res.status(400).send(patientHistoryDateRes.err);
  }

  const checker = setInterval(function() {
    if (completed === patientHistoryDateRes.length) {
      clearInterval(checker);
      res.status(200).send(finalResponse);
    }
  }, 1000);

  _.forEach(patientHistoryDateRes, async function(info) {
    const checkupHistoryRes = await scheduleCheckupDao.getCheckupHistoryViaScheduleCheckupId(
      info.schedule_checkup_id
    );

    if (checkupHistoryRes.err) {
      res.status(400).send(checkupHistoryRes.err);
    }

    const soapRes = await scheduleCheckupDao.getPatientSoapViaScheduleCheckupId(
      info.schedule_checkup_id
    );

    if (soapRes.err) {
      res.status(400).send(soapRes.err);
    }

    const prescribedMedRes = await scMedicineDao.getPrescribeMedicineViaScheduleCheckupId(
      info.schedule_checkup_id
    );

    if (prescribedMedRes.err) {
      res.status(400).send(prescribedMedRes.err);
    }

    info.sc_checkup_history = checkupHistoryRes[0];
    info.sc_soap = soapRes[0];
    info.sc_prescribed_medicine = prescribedMedRes;
    finalResponse.push(info);

    completed++;
  });
}


async function getPatientCheckupHistory(patientId, res) {
  try {
    console.log('Entering getPatientCheckupHistory service');

    const patientHistoryDateRes = await scheduleCheckupDao.getPatientHistoryDateList(patientId);
    if (patientHistoryDateRes.err) {
      return res.status(400).send(patientHistoryDateRes.err);
    }

    const scheduleCheckupIds = patientHistoryDateRes.map(info => parseInt(info.schedule_checkup_id));

    // Fetch all related data in parallel to minimize DB calls
    const [
      checkupHistories,
      soapRecords,
      prescribedMeds
    ] = await Promise.all([
      scheduleCheckupDao.getCheckupHistoryViaScheduleCheckupIds(scheduleCheckupIds),
      scheduleCheckupDao.getPatientSoapViaScheduleCheckupIds(scheduleCheckupIds),
      scMedicineDao.getPrescribeMedicineViaScheduleCheckupIds(scheduleCheckupIds)
    ]);

    // Use map function instead of makeMap
    const finalResponse = patientHistoryDateRes.map(info => {
      const sc_checkup_history = checkupHistories.find(ch => ch.schedule_checkup_id === info.schedule_checkup_id) || null;
      const sc_soap = soapRecords.find(soap => soap.schedule_checkup_id === info.schedule_checkup_id) || null;
      const sc_prescribed_medicine = prescribedMeds.filter(med => med.schedule_checkup_id === info.schedule_checkup_id) || [];

      return {
        ...info,
        sc_checkup_history,
        sc_soap,
        sc_prescribed_medicine
      };
    });

    console.log(finalResponse.length);
    res.status(200).send(finalResponse);
  } catch (error) {
    console.error('Error in getPatientCheckupHistory:', error);
    res.status(500).send({ error: 'Internal Server Error' });
  }
}

async function isPatientScheduledToday(patientId, res) {
  console.log('entering isPatientScheduledToday service');

  const response = await patientDao.isPatientScheduledToday(patientId);

  if (response.err) {
    res.status(400).send(response.err);
  } else {
    res.status(200).send(response);
  }
}

/**
 *
 * @param {*} patientId
 * @param {*} res
 */
async function deleteFile(googleId, res) {
  console.log('entering deleteFile service');

  const schema = Joi.object()
  .keys({
    google_id: Joi.string()
      .allow('')
      .allow(null)
  })
  .unknown();

const validate = Joi.validate({ google_id: googleId }, schema);

  if (validate.error == null) {
    const response = await patientDao.deleteFile(googleId);
    if (response.err) {
      res.status(400).send(response.err);
    } else {
      const jwtClient = await googleDriveAuth();

      drive.files.delete(
        {
          auth: jwtClient,
          fileId: googleId
        },
        async function(err, file) {
          if (err) {
            res.status(400).send(err);
          } else {
           
          }
        }
      );
      
      res.status(200).send('File successfully deleted');
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }

}

exports.insertPatient = insertPatient;
exports.getPatientList = getPatientList;
exports.updatePatient = updatePatient;
exports.getPatientInfoById = getPatientInfoById;
exports.deletePatient = deletePatient;
exports.insertTodayPatient = insertTodayPatient;
exports.getTodaySchedulePatientList = getTodaySchedulePatientList;
exports.prescribedPatientMedicine = prescribedPatientMedicine;
exports.purchasePatientMedicine = purchasePatientMedicine;
exports.updateSchedulePatientStatus = updateSchedulePatientStatus;
exports.savePatientCheckup = savePatientCheckup;
exports.getPatientCheckupHistoryList = getPatientCheckupHistoryList;
exports.getPatientCheckupHistoryByDate = getPatientCheckupHistoryByDate;
exports.upload = googleDriveUploadFile;
exports.getPatientFileList = googleDriveListAllFiles;
exports.getPatientConfinementList = getPatientConfinementList;
exports.saveMedicalHistory = saveMedicalHistory;
exports.updatePrescribedPatientMedicine = updatePrescribedPatientMedicine;
exports.getPatientMedicalHistory = getPatientMedicalHistory;
exports.getPrescribeMedicine = getPrescribeMedicine;
exports.schedulePatient = schedulePatient;
exports.getPatientTestResultByScheduleCheckupId = getPatientTestResultByScheduleCheckupId;
exports.getPatientTestResultByPatientId = getPatientTestResultByPatientId;
exports.isPatientDelivered = isPatientDelivered;
exports.getPatientCheckupHistory = getPatientCheckupHistory;
exports.updatePatientCheckup = updatePatientCheckup;
exports.isPatientScheduledToday = isPatientScheduledToday;
exports.deleteFile = deleteFile;
