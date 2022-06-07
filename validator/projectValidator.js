const { body, validationResult } = require('express-validator');
const { Project } = require("../models");
const { Op } = require("sequelize");

exports.createProjectValidation = (req, res) => {
  return [
    body('name', 'Project Name is Required').notEmpty().trim(),
    // body('description', 'description  is Required').notEmpty(),
    body('address','Address is Required').notEmpty().trim(),
    body('name').custom(async value => {
      return await Project.findOne({ where: { name: value }, raw: true }).then(project => {
        if (project) {
          return Promise.reject('Project Name Already Taken')
        }
      })
    })
  ]
}

exports.updateProjectValidation = () => {
  return [
    body('name').custom(async (value, { req }) => {
      return await Project.findOne({
        where: {
          id: {
            [Op.ne]: req.params.projectId
          },
          name: value,
        }, raw: true
      })
        .then(projects => {
          if (projects) {
            return Promise.reject('Project Name Already Taken')
          }
        })
    }),
  ]
}


