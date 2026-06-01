const Joi = require('joi');

const scheduleCheckupDao = require('../daos/admin.schedule_checkup.dao');

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function updateSchedulePatientStatus(data, res) {
  console.log('entering insertPatientDelivery service');

  const schema = Joi.object().keys({
    patient_id: Joi.number().allow('').allow(null),
    status_id: Joi.number().allow('').allow(null)
  }).unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const response = await scheduleCheckupDao.updateSchedulePatientStatus(data);

    if(response.err){
      res.status(400).send(response.err);
    }else{
      res.status(200).send('Patient Status successfully updated');
    }
    
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}


exports.updateSchedulePatientStatus = updateSchedulePatientStatus;
