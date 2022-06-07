const { body, validationResult } = require('express-validator');
const { Property } = require("../models");
const { Op } = require("sequelize");


exports.createPropertyValidation = (req, res) => {
  return [
    body('project_id', 'Project is Required').notEmpty(),
    body('property_type_id', 'Property type is Required').notEmpty(),
    body('number', 'Number is Required').notEmpty().trim(),
    //body('name', 'Property  Name is Required').notEmpty().trim(),
    // body('length', 'Length').notEmpty(),
    //body('breadth', 'Breadth is Required').notEmpty(),
    body('property_size', 'Property size is Required').notEmpty(),
    body('price', 'price is Required').notEmpty().trim(),
    body('rate_per_sq_ft', 'Rate per sq ft is Required').notEmpty().trim(),
    body('number').custom(async (value, { req }) => {
      return await Property.findOne({ where: { number: value, project_id: req.body.project_id } }).then(property => {
        if (property) {
          return Promise.reject('Property Number already exists.')
        }
      })
    })
  ]
}

exports.updatePropertyValidation = () => {
  return [
    body('number').custom((value, { req }) => {
      return Property.findOne({
        where: {
          id: {
            [Op.ne]: req.params.propertyId
          },
          project_id: req.body.project_id,
          number: value
        }
      })
        .then(property => {
          if (property) {
            return Promise.reject('Property Number already exists.')
          }
        })
    }),
  ]
}
