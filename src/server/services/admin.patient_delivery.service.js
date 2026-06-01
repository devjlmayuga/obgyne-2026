const Joi = require('joi');
const _ = require('underscore');
const patientDeliveryDao = require('../daos/admin.patient_delivery.dao');

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function insertPatientDelivery(data, res) {
  console.log('entering insertPatientDelivery service');

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
    const response = await patientDeliveryDao.insertPatientDelivery(del);

    if (response.err) {
      res.status(400).send(response.err);
    }
  });

  res.status(200).send('Patient Delivery successfully added');
}

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function updatePatientDelivery(data, patient_id, res) {
  console.log('entering updatePatientDelivery service');

  await patientDeliveryDao.deletePatientDelivery(patient_id);

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
    const response = await patientDeliveryDao.insertPatientDelivery(del);
    if (response.err) {
      res.status(400).send(response.err);
    }
  });

  res.status(200).send('Patient Delivery successfully updated');
}

async function getPatientDeliveryList(res) {
  console.log('entering getPatientDeliveryList service');
  const patientDeliveryList = await patientDeliveryDao.getPatientDeliveryList();

  if (patientDeliveryList.err) {
    res.status(400).send(patientDeliveryList.err);
  } else {
    res.status(200).send(patientDeliveryList);
  }
}

/**
 *
 * @param {*} patientId
 * @param {*} res
 */
async function getPatientDeliveryListByPatientId(patientId, res) {
  console.log('entering getPatientDeliveryListByPatientId service');

  const schema = Joi.object()
    .keys({
      patient_id: Joi.number()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate({ patient_id: patientId }, schema);
  let patientInfo = null;
  if (validate.error == null) {
    patientInfo = await patientDeliveryDao.getPatientDeliveryListByPatientId(
      patientId
    );

    if (patientInfo.err) {
      res.status(400).send(patientInfo.err);
    } else {
      res.status(200).send(patientInfo);
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
async function deletePatientDelivery(data, res) {
  console.log('entering deletePatientDelivery service');

  const schema = Joi.object()
    .keys({
      patient_id: Joi.number()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await patientDeliveryDao.deletePatientDelivery(data);

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

exports.insertPatientDelivery = insertPatientDelivery;
exports.getPatientDeliveryList = getPatientDeliveryList;
exports.updatePatientDelivery = updatePatientDelivery;
exports.getPatientDeliveryListByPatientId = getPatientDeliveryListByPatientId;
exports.deletePatientDelivery = deletePatientDelivery;
