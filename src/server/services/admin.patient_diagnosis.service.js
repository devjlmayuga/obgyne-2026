const Joi = require('joi');

const patientDiagnosisDao = require('../daos/admin.patient_diagnosis.dao');

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function insertPatientDiagnosis(data, res) {
  console.log('entering insertPatientDiagnosis service');

  const schema = Joi.object().keys({
    patient_id: Joi.number().allow('').allow(null),
    comment: Joi.string().allow('').allow(null)
  }).unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await patientDiagnosisDao.insertPatientDiagnosis(data);
    
    if(response.err){
      res.status(400).send(response.err)
    }else{
      res.status(200).send('Patient diagnosis successfully added');
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
async function updatePatientDiagnosis(data, res) {
  console.log('entering updatePatientDiagnosis service');

  const schema = Joi.object().keys({
    patient_id: Joi.number().allow('').allow(null),
    comment: Joi.string().allow('').allow(null)
  }).unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await patientDiagnosisDao.updatePatientDiagnosis(data);

    if(response.err){
      res.status(400).send(response.err)
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
  res.status(200).send('Patient diagnosis successfully updated');
}


async function getPatientDiagnosisList(res) {
  console.log('entering getPatientDiagnosisList service');
  const patientDiagnosisList = await patientDiagnosisDao.getPatientDiagnosisList();

  if(patientDiagnosisList.err){
    res.status(400).send(patientDiagnosisList.err)
  }else{
    res.status(200).send(patientDiagnosisList)
  }
}


/**
 *
 * @param {*} patientId
 * @param {*} res
 */
async function getPatientDiagnosisListByPatientId(patientId, res) {
  console.log('entering getPatientDiagnosisListByPatientId service');

  const schema = Joi.object().keys({
    patient_id: Joi.number().allow('').allow(null)
  }).unknown();

  const validate = Joi.validate({ patient_id: patientId }, schema);
  let patientInfo = null;
  if (validate.error == null) {
    patientInfo = await patientDiagnosisDao.getPatientDiagnosisListByPatientId(patientId);

    
  if(patientInfo.err){
    res.status(400).send(patientInfo.err)
  }else{
    res.status(200).send(patientInfo)
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
async function deletePatientDiagnosis(data, res) {
  console.log('entering deletePatientDiagnosis service');

  const schema = Joi.object().keys({
    patient_id: Joi.number().allow('').allow(null),
    patient_diagnosis_id: Joi.number().allow('').allow(null)
  }).unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await patientDiagnosisDao.deletePatientDiagnosis(data);

    if(response.err){
      res.status(400).send(response.err);
    } else {
      res.status(200).send('Patient successfully deleted');
    }
    
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

exports.insertPatientDiagnosis = insertPatientDiagnosis;
exports.getPatientDiagnosisList = getPatientDiagnosisList;
exports.updatePatientDiagnosis = updatePatientDiagnosis;
exports.getPatientDiagnosisListByPatientId = getPatientDiagnosisListByPatientId;
exports.deletePatientDiagnosis = deletePatientDiagnosis;
