const Joi = require('joi');
const _u = require('underscore');

const medicineDao = require('../daos/admin.medicine.dao');
const purchasedMedicineDao = require('../daos/admin.purchase_medicine.dao');

/**
 *
 * @param {*} data
 * @param {*} res
 */
async function insertMedicine(data, res) {
  console.log('entering insertMedicine service');

  const schema = Joi.object()
    .keys({
      name: Joi.string()
        .allow('')
        .allow(null),
      mg: Joi.number()
        .allow('')
        .allow(null),
      qty: Joi.number()
        .allow('')
        .allow(null),
      unit_price: Joi.number()
        .allow('')
        .allow(null),
      description: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const isExisting = await isExistingMed(data, res);

    if (!isExisting) {
      const response = await medicineDao.insertMedicine(data);

      if (response.err) {
        res.status(400).send(response.err);
      } else {
        res.status(200).send('Medicine successfully added');
      }
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
async function updateMedicine(data, res) {
  console.log('entering updateMedicine service');

  const schema = Joi.object()
    .keys({
      name: Joi.string()
        .allow('')
        .allow(null),
      mg: Joi.number()
        .allow('')
        .allow(null),
      qty: Joi.number()
        .allow('')
        .allow(null),
      unit_price: Joi.number()
        .allow('')
        .allow(null),
      medicine_id: Joi.number()
        .allow('')
        .allow(null),
      description: Joi.string()
        .allow('')
        .allow(null)
    })
    .unknown();

  const validate = Joi.validate(data, schema);

  if (validate.error == null) {
    const isExisting = await isExistingMed(data, res);

    if (!isExisting) {
      const response = await medicineDao.updateMedicine(data);

      if (response.err) {
        res.status(400).send(response.err);
      } else {
        res.status(200).send('Medicine successfully updated');
      }
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

async function getMedicineList(query, res) {
  console.log('entering getMedicineList service');
  const patientList = await medicineDao.getMedicineList(query);

  if (patientList.err) {
    res.status(400).send(patientList.err);
  } else {
    res.status(200).send(patientList);
  }
}

/**
 *
 * @param {*} medicineId
 * @param {*} res
 */
async function getMedicineInfoById(medicineId, res) {
  console.log('entering getMedicineInfoById service');

  const schema = Joi.object()
    .keys({
      medicine_id: Joi.number()
        .allow('')
        .allow(null)
    })
    .unknown();
  const validate = Joi.validate({ medicine_id: medicineId }, schema);

  let medicineInfo = null;

  if (validate.error == null) {
    medicineInfo = await medicineDao.getMedicineInfoById(medicineId);

    if (medicineInfo.err) {
      res.status(400).send(medicineInfo.err);
    } else {
      res.status(200).send(medicineInfo);
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
}

/**
 *
 * @param {*} medicineId
 * @param {*} res
 */
async function deleteMedicine(medicineId, res) {
  console.log('entering deleteMedicine service');

  const schema = Joi.object()
    .keys({
      medicine_id: Joi.number()
        .allow('')
        .allow(null)
    })
    .unknown();
  const validate = Joi.validate({ medicine_id: medicineId }, schema);

  if (validate.error == null) {
    const response = await medicineDao.deleteMedicine(medicineId);

    if (response.err) {
      res.status(400).send(response.err);
    } else {
      res.status(200).send('Medicine successfully deleted');
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }
  res.status(200).send('Medicine successfully deleted');
}

/**
 *
 * @param {*} res
 */
async function getTotalSaleToday(res) {
  console.log('entering getTotalSaleToday service');

  const result = await purchasedMedicineDao.getTotalSaleToday();

  if (result.err) {
    res.status(400).send(result.err);
  } else {
    let total_sale_today = 0;

    _u.forEach(result, function(med) {
      total_sale_today =
        parseFloat(total_sale_today) + parseFloat(med.total_amount);
    });

    const sales = {
      sales: result,
      total_sale_today: total_sale_today
    };

    res.status(200).send(sales);
  }
}

async function isExistingMed(data, res) {
  if (data.medicine_id) {
    //update
    const currentMedDetails = await medicineDao.getMedicineInfoById(
      data.medicine_id
    );

    if (data.name != currentMedDetails[0].name) {
      const isExising = await medicineDao.isMedicineExising(data.name);

      if (isExising.length > 0) {
        res.status(400).send(`Error saving ${data.name} - Duplicate record.`);
        return true;
      }
    } else {
      return false;
    }
  } else {
    //save
    const isExising = await medicineDao.isMedicineExising(data.name);

    if (isExising.length > 0) {
      res.status(400).send(`Error saving ${data.name} - Duplicate record.`);
      return true;
    }
  }
}

exports.insertMedicine = insertMedicine;
exports.getMedicineList = getMedicineList;
exports.updateMedicine = updateMedicine;
exports.getMedicineInfoById = getMedicineInfoById;
exports.deleteMedicine = deleteMedicine;
exports.getTotalSaleToday = getTotalSaleToday;
