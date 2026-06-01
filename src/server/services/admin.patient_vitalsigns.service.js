const Joi = require('joi');

const patientVitalsignsDao = require('../daos/admin.sc_vitalsigns.dao');

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function insertPatientVitalsigns(data, res) {
  console.log('entering insertPatientVitalsigns service');

  const schema = Joi.object().keys({
    patient_id: Joi.number().allow('').allow(null),
    weight: Joi.string().allow('').allow(null),
    bp : Joi.string().allow('').allow(null),
    cr : Joi.string().allow('').allow(null),
    temp : Joi.string().allow('').allow(null),
    remarks : Joi.string().allow('').allow(null)
  }).unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await patientVitalsignsDao.insertPatientVitalsigns(data);

    if(response.err){
      res.status(400).send(response.err);
    }else{
      res.status(200).send('Patient Vitalsigns successfully added');
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
async function updatePatientVitalsigns(data, res) {
  console.log('entering updatePatientVitalsigns service');

  const schema = Joi.object().keys({
    patient_vitalsigns_id : Joi.number().allow('').allow(null),
    patient_id: Joi.number().allow('').allow(null),
    weight: Joi.string().allow('').allow(null),
    bp : Joi.string().allow('').allow(null),
    cr : Joi.string().allow('').allow(null),
    temp : Joi.string().allow('').allow(null),
    remarks : Joi.string().allow('').allow(null)
  }).unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await patientVitalsignsDao.updatePatientVitalsigns(data);

    if(response.err){
      res.status(400).send(response.err);
    }else{
      res.status(200).send('Patient Vitalsigns successfully updated');
    }

  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}


async function getPatientVitalsignsList(res) {
  console.log('entering getPatientVitalsignsList service');
  const patientVitalsignsList = await patientVitalsignsDao.getPatientVitalsignsList();

  if(patientVitalsignsList.err){
    res.status(400).send(patientVitalsignsList.err);
  }else{
    res.status(200).send(patientVitalsignsList);
  }
}


/**
 *
 * @param {*} patientId
 * @param {*} res
 */
async function getPatientVitalsignsListByPatientId(patientId, res) {
  console.log('entering getPatientVitalsignsListByPatientId service');

  const schema = Joi.object().keys({
    patient_id: Joi.number().allow('').allow(null)
  }).unknown();

  const validate = Joi.validate({ patient_id: patientId }, schema);
  let patientInfo = null;
  if (validate.error == null) {
    patientInfo = await patientVitalsignsDao.getPatientVitalsignsListByPatientId(patientId);

    if(patientInfo.err){
      res.status(400).send(patientInfo.err);
    } else {
      resstatus(200).send(patientInfo);

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
async function deletePatientVitalsigns(data, res) {
  console.log('entering deletePatientVitalsigns service');

  const schema = Joi.object().keys({
    patient_id: Joi.number().allow('').allow(null),
    patient_Vitalsigns_history_id: Joi.number().allow('').allow(null)
  }).unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await patientVitalsignsDao.deletePatientVitalsigns(data);

    if(response.err){
      res.status(400).send(response.err);
    }else{
      res.status(200).send('Patient successfully deleted');
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

exports.insertPatientVitalsigns = insertPatientVitalsigns;
exports.getPatientVitalsignsList = getPatientVitalsignsList;
exports.updatePatientVitalsigns = updatePatientVitalsigns;
exports.getPatientVitalsignsListByPatientId = getPatientVitalsignsListByPatientId;
exports.deletePatientVitalsigns = deletePatientVitalsigns;
