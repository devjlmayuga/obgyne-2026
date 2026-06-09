const jwt = require('jsonwebtoken');
const Joi = require('joi');
const config = require('../configuration');
const userDao = require('./../daos/admin.user.dao');

async function insertData() {
  console.log('entering insertData service');
  const res = await userDao.insertData();

  return res;
}

async function getList() {
  console.log('entering getList service');
  const res = await userDao.getList();
  return res;
}

async function resetPassword(user, res) {
  console.log('entering resetPassword service');

  const schema = Joi.object().keys({
    username: Joi.string(),
    password: Joi.string(),
    new_password: Joi.string()
  });

  const validate = Joi.validate(user, schema);

  if (validate.error == null) {

    const isUserExist = await userDao.isUserExisting(user);

    if(!isUserExist){
      res.status(400).send('Incorrect username or password');
    } else {
      const restPassResult = await userDao.resetPassword(
        user.username,
        user.new_password
      );

      if(restPassResult.err){
        res.status(400).send(restPassResult.err);
      }else{
        res.status(200).send('Password successfuly updated');
      }
    }
  } else {
    res.status(400).send(validate.error.details);
    return;
  }



}

async function isUserExisting(req, res) {
  const { body: userCred } = req;
  const schema = {
    username: Joi.string(),
    password: Joi.string()
  };

  const validate = Joi.validate(userCred, schema, { abortEarly: false });

  if (validate.error != null) {
    res.status(400).send(validate.error.details);
    return;
  }

  const isUserExistingResult = await userDao.isUserExisting(userCred);

  if (isUserExistingResult) {
    const tokenDetails = {
      username: userCred.username
    };
    jwt.sign(
      { tokenDetails },
      config.auth.secret,
      { expiresIn: config.auth.expiration },
      (err, generatedToken) => {
        jwt.verify(generatedToken, config.auth.secret, (err, authData) => {
          if (err) {
            res.send('expired token');
          }

          res.send({ authToken: generatedToken, exp: new Date(authData.exp*1000), iat: new Date(authData.iat*1000) });

        });
      },
    );

    
  } else {
    res.status(400).send({ message: 'The password you’ve entered is incorrect.' });
  }
}

exports.insertData = insertData;
exports.getList = getList;
exports.isUserExisting = isUserExisting;
exports.resetPassword = resetPassword;
