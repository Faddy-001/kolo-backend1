const { body, validationResult } = require('express-validator');
const { User } = require("../models");
const { Op } = require("sequelize");

exports.createUserValidation = (req, res) => {
  return [
    body('name', 'Name Is required').notEmpty().trim(),
    body('email', 'Email is required').notEmpty().isEmail(),
    body('gender', 'Gender is Required').notEmpty(),
    body('phone', 'Invalid Phone').notEmpty().isLength({ min: 10, max: 10 }),
    body('role_id', 'Role is Required').notEmpty(),
    body('password', 'Password is required').notEmpty().trim(),
    body('projects', 'Project and Department is Required').notEmpty(),
    //body('address', 'Address is Required').notEmpty().trim(),
    body('email').custom(value => {
      return User.findOne({ where: { email: value } }).then(user => {
        if (user) {
          return Promise.reject('Email already exists.');
        }
      });
    }),
    body('phone').custom(value => {
      return User.findOne({ where: { phone: value } }).then(user => {
        if (user) {
          return Promise.reject('Phone number already exists.');
        }
      });

    })
  ]
}

exports.updateUserValidator = () => {
  return [
    body('email').custom((value, {req}) => {
      return User.findOne({
        where: {
          id: { [Op.ne]: req.params.userId },
          email: value
        }
      }).then(user => {
        if (user) {
          return Promise.reject('Email already exists.');
        }
      });
    }),
    body('phone').custom((value, {req}) => {
      return User.findOne({
        where: {
          id: { [Op.ne]: req.params.userId },
          phone: value
        }
      }).then(user => {
        if (user) {
          return Promise.reject('Phone number already exists.');
        }
      });

    })
  ]
}



