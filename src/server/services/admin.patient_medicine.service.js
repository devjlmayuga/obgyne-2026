const Joi = require('joi');

const patientMedicineDao = require('../daos/admin.patient_medicine.dao');

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function insertPatientMedicine(data, res) {
  console.log('entering insertPatientMedicine service');

  const schema = Joi.object().keys({
    patient_id: Joi.number().allow('').allow(null),
    medicine_id: Joi.number().allow('').allow(null),
    med_qty: Joi.number().allow('').allow(null)
  }).unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await patientMedicineDao.insertPatientMedicine(data);
    
    if(response.err){
      res.status(400).send(response.err);
    }else{
      res.status(200).send('Patient Medicine successfully added');
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
async function updatePatientMedicine(data, res) {
  console.log('entering updatePatientMedicine service');

  const schema = Joi.object().keys({
    patient_medicine_id: Joi.number().allow('').allow(null),
    patient_id: Joi.number().allow('').allow(null),
    medicine_id: Joi.number().allow('').allow(null),
    med_qty: Joi.number().allow('').allow(null)
  }).unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await patientMedicineDao.updatePatientMedicine(data);

    if(response.err){
      res.status(400).send(response.err);
    }else{
      res.status(200).send('Patient Medicine successfully updated');
    }

  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}


async function getPatientMedicineList(query, res) {
  console.log('entering getPatientMedicineList service');
  const patientList = await patientMedicineDao.getPatientMedicineList(query);

    if(patientList.err){
      res.status(400).send(patientList.err)
    }else{
      res.status(200).send(patientList)
    }
}


/**
 *
 * @param {*} patientMedicineId
 * @param {*} res
 */
async function getPatientMedicineInfoById(patientMedicineId, res) {
  console.log('entering getPatientMedicineInfoById service');

  const schema = Joi.object().keys({
    patient_medicine_id: Joi.number().allow('').allow(null),
  }).unknown();
  const validate = Joi.validate({ patient_medicine_id: patientMedicineId }, schema);

  let medicineInfo = null;

  if (validate.error == null) {
    medicineInfo = await patientMedicineDao.getPatientMedicineInfoById(patientMedicineId);

    if(medicineInfo.err){
      res.status(400).send(medicineInfo.err)
    }else{
      res.status(200).send(medicineInfo);
    }

  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

/**
 *
 * @param {*} patientMedicineId
 * @param {*} res
 */
async function deletePatientMedicine(patientMedicineId, res) {
  console.log('entering deletePatientMedicine service');

  const schema = Joi.object().keys({
    patient_medicine_id: Joi.number().allow('').allow(null),
  }).unknown();
  const validate = Joi.validate({ patient_medicine_id: patientMedicineId }, schema);

  if (validate.error == null) {
    const response = await patientMedicineDao.deletePatientMedicine(patientMedicineId);

    if(response.err){
      res.status(400).send(response.err)
    }else{
      res.status(200).send('Patient Medicine successfully deleted');
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
async function getPatientMedicineListByPatientId(patientId, res) {
  console.log('entering getPatientMedicineListByPatientId service');

  const schema = Joi.object().keys({
    patient_id: Joi.number().allow('').allow(null),
  }).unknown();
  const validate = Joi.validate({ patient_id: patientId }, schema);

  let patientMedicineList = null;

  if (validate.error == null) {
    patientMedicineList = await patientMedicineDao.getPatientMedicineListByPatientId(patientId);

    if(patientMedicineList.err){
      res.status(400).send(patientMedicineList.err);
    }else{
      res.status(200).send(patientMedicineList);
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

exports.insertPatientMedicine = insertPatientMedicine;
exports.getPatientMedicineList = getPatientMedicineList;
exports.updatePatientMedicine = updatePatientMedicine;
exports.getPatientMedicineInfoById = getPatientMedicineInfoById;
exports.deletePatientMedicine = deletePatientMedicine;
exports.getPatientMedicineListByPatientId = getPatientMedicineListByPatientId;
