//  This is a file from my BE api (project shvab.fund)
//  Just show how I use data validation on BE
//  Not implemented in the test due to lack of time

const express = require('express');
const router = express.Router();

const Validator = require('validator');
const isEmpty = require('lodash/isEmpty');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const mongoose = require('mongoose');
const models = require('../models');
const user = models.user;
const config = require('../config');
const jwt = require('jsonwebtoken');
const authenticate = require('../middlewares/authenticate');

function validateInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.userName)) {
    errors.userName = 'Name is required';
  }

  if (!Validator.isAlphanumeric(data.userName)) {
    errors.userName = 'Only latin letters and numbers';
  }

  if (!Validator.isEmail(data.userEmail)) {
    errors.userEmail = 'Email is invalid';
  }

  if (Validator.isEmpty(data.userEmail)) {
    errors.userEmail = 'Email is required';
  }

  if (Validator.isEmpty(data.userPassword)) {
    errors.userPassword = 'Password is required';
  }

  if (!Validator.isLength(data.userName, { min: 4, max: 16 })) {
    errors.userName = 'Length 4-16 characters';
  }

  if (Validator.contains(data.userName, ' ')) {
    errors.userName = 'Do not use whitespaces';
  }

  if (!Validator.isLength(data.userPassword, { min: 5, max: 16 })) {
    errors.userPassword = 'Length 5-16 characters';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

router.post('/', (req, res) => {
  console.log(req.body);

  const validateResult = validateInput(req.body);

  if (validateResult.isValid) {
    const {
      userName,
      userEmail,
      userPassword,
      userNewsSubscription
    } = req.body;

    const password_digest = bcrypt.hashSync(userPassword, salt);

    user.findOne({ username: userName }).then(userFromDB => {
      if (!userFromDB) {
        user.findOne({ email: userEmail }).then(userFromDB => {
          if (!userFromDB) {
            user
              .create({
                _id: new mongoose.Types.ObjectId(),
                username: userName,
                password_digest,
                email: userEmail,
                newsSubscription: userNewsSubscription
              })
              .then(userToDB => {
                //console.log('Добавлен новый пользователь:\n' + userToDB);
                const token = jwt.sign(
                  {
                    id: userToDB._id,
                    username: userToDB.username
                  },
                  config.JWT_SECRET
                );
                validateResult.token = token;
                res.json(validateResult);
              })
              .catch(err => {
                console.log(
                  'K8 ERROR: Не получилось добавить пользоваттеля в базу'
                );
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          } else {
            validateResult.errors.userEmail = 'This e-mail already exists';
            validateResult.isValid = false;
            res.json(validateResult);
          }
        });
      } else {
        validateResult.errors.userName = 'This username already exists';
        validateResult.isValid = false;
        res.json(validateResult);
      }
    });
  } else {
    res.json(validateResult);
  }
});

router.get('/checkusername/:identifier', (req, res) => {
  user.findOne({ username: req.params.identifier }).then(userFromDB => {
    userFromDB.password_digest = null;
    userFromDB.group = null;
    res.json({ userFromDB });
  });
});

router.get('/checkuseremail/:identifier', (req, res) => {
  user.findOne({ email: req.params.identifier }).then(userFromDB => {
    userFromDB.password_digest = null;
    userFromDB.group = null;
    res.json({ userFromDB });
  });
});

router.get('/myprofile/', authenticate, (req, res) => {
  let userFromDB = req.currentUser;

  userFromDB.password_digest = null;
  userFromDB.group = null;
  res.json({ userFromDB });
});

router.post('/changename', authenticate, (req, res) => {
  let userFromDB = req.currentUser;
  user.findOne({ _id: userFromDB._id }).then(userFromDBToChange => {
    userFromDBToChange.name = req.body.newName;
    userFromDBToChange.save().then(userAfterChange => {
      res.json({ newName: userAfterChange.name });
    });
  });
});

router.post('/changephone', authenticate, (req, res) => {
  let userFromDB = req.currentUser;
  user.findOne({ _id: userFromDB._id }).then(userFromDBToChange => {
    userFromDBToChange.phoneNumber = req.body.newPhoneNumber;
    userFromDBToChange.save().then(userAfterChange => {
      res.json({ newPhoneNumber: userAfterChange.phoneNumber });
    });
  });
});

router.post('/changenewssubscription', authenticate, (req, res) => {
  let userFromDB = req.currentUser;
  user.findOne({ _id: userFromDB._id }).then(userFromDBToChange => {
    userFromDBToChange.newsSubscription = req.body.newsSubscription;
    userFromDBToChange.save().then(userAfterChange => {
      res.json({ newNewsSubscription: userAfterChange.newsSubscription });
    });
  });
});

router.post('/changewithdrawemailconfirmation', authenticate, (req, res) => {
  let userFromDB = req.currentUser;
  user.findOne({ _id: userFromDB._id }).then(userFromDBToChange => {
    userFromDBToChange.withdrawEmailConfirmation =
      req.body.withdrawEmailConfirmation;
    userFromDBToChange.save().then(userAfterChange => {
      res.json({
        newWithdrawEmailConfirmation: userAfterChange.withdrawEmailConfirmation
      });
    });
  });
});

function validateChangePasswordInput(data) {
  let errors = {};

  if (Validator.isEmpty(data.oldPasswordInForm)) {
    errors.oldPassword = 'Field is required';
  }

  if (Validator.isEmpty(data.newPasswordInForm)) {
    errors.newPassword = 'Field is required';
  }

  if (Validator.isEmpty(data.confirmNewPasswordInForm)) {
    errors.confirmNewPassword = 'Field is required';
  }

  if (!Validator.isLength(data.newPasswordInForm, { min: 5, max: 16 })) {
    errors.newPassword = 'Length 5-16 characters';
  }

  if (data.newPasswordInForm != data.confirmNewPasswordInForm) {
    errors.confirmNewPassword = 'Field values do not match';
    errors.newPassword = 'Field values do not match';
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
}

router.post('/changepassword', authenticate, (req, res) => {
  const validateResult = validateChangePasswordInput(req.body);

  function fSendInvalidCredentials() {
    validateResult.isValid = false;
    validateResult.errors.form = 'Old password is incorrect';
    res.json(validateResult);
  }

  function fSendOk() {
    validateResult.isValid = true;
    res.json(validateResult);
  }

  if (validateResult.isValid) {
    let userFromDB = req.currentUser;
    const { oldPasswordInForm, newPasswordInForm } = req.body;
    if (bcrypt.compareSync(oldPasswordInForm, userFromDB.password_digest)) {
      user.findOne({ _id: userFromDB._id }).then(userFromDBToChange => {
        userFromDBToChange.password_digest = bcrypt.hashSync(
          newPasswordInForm,
          salt
        );

        userFromDBToChange.save().then(userAfterChange => {
          fSendOk();
        });
      });
    } else {
      fSendInvalidCredentials();
    }
  } else {
    res.json(validateResult);
  }
});

module.exports = router;
