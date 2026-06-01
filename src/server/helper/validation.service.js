const _u = require('underscore');


async function requiredFields(madatoryFields, data, res) {
  console.log('entering getList service');

  try {
    _u.forEach(madatoryFields, (field) => {
      const attibute = _u.has(data, field);
      console.log(field, attibute);
      if (!attibute) {
        res.send(`${field} is required`);
        throw new Error('break');
      }
    });
    return 'valid';
  } catch (e) {
    if (e.message === 'break') {
      return 'error';
    }
  }

  return 'done validation';
}


exports.requiredFields = requiredFields;
