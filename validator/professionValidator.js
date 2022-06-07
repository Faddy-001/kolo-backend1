const { body, validationResult } = require('express-validator');
const { Profession } = require("../models");
const { Op } = require("sequelize");

exports.createProfessionValidation = (req, res) => {
  return [
    body('name', 'Name is Required').notEmpty().trim(),
    //body('description', 'description  is Required').notEmpty(),
    body('name').custom(async value => {
      return await Profession.findOne({ where: { name: value } }).then(profession => {
        if (profession) {
          return Promise.reject('Profession already exists.')
        }
      })
    })
  ]
}
exports.updateProfessionValidation = () => {
  return [
    body('name').custom(async (value, { req }) => {

      return await Profession.findOne({
        where:
        {
          id: {
            [Op.ne]: req.params.professionId
          }, name: value
        },
      })
        .then(profession => {
          if (profession) {
            return Promise.reject('Profession already exists.')
          }
        })
    }),
  ]
}