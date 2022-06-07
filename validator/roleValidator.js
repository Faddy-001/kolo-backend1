const { body, validationResult } = require('express-validator');
const { Role } = require("../models");
const { Op } = require("sequelize");

exports.createRoleValidation = (req, res) => {
  return [
    body('name', 'Name is Required').notEmpty().trim(),

    // body('description', 'description  is Required').notEmpty(),
    body('name').custom(async value => {
      return await Role.findOne({ where: { name: value } }).then(role => {
        if (role) {
          return Promise.reject('Role already exists.')
        }
      })
    })
  ]
}

exports.updateRoleValidation = () => {
  return [
    body('name').custom(async (value, { req }) => {

      return await Role.findOne({
        where:
        {
          id: {
            [Op.ne]: req.params.roleId
          }, name: value
        }, raw: true
      })
        .then(roles => {
          if (roles) {
            return Promise.reject('Role already exists.')
          }
        })

    }),
  ]
}


