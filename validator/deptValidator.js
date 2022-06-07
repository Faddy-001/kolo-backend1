const { body, validationResult } = require('express-validator');
const { Department } = require("../models");
const { Op } = require("sequelize");
exports.createDeptValidation = (req, res) => {
  return [
    body('name', 'Department Name is Required').notEmpty().trim(),
    // body('description', 'description is Required').notEmpty(),
    body('project_id', 'Project is Required').notEmpty(),
    body('name').custom(async (value, { req }) => {
      return await Department.findOne({ where: { name: value, project_id: req.body.project_id } }).then(department => {
        if (department) {
          return Promise.reject('Department already exists in this Project.')
        }
      })
    })
  ]
}

exports.updateDepartmentValidation = () => {
  return [
    body('name').custom((value, { req }) => {
      return Department.findOne({
        where:
        {
          id: {
            [Op.ne]: req.params.departmentId
          },
          project_id: req.body.project_id,
          name: value
        }
      }).then(department => {
        if (department) {
          return Promise.reject('Department already exists.')
        }
      })
    }),
  ]
}


