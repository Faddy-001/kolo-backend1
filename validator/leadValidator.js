const { body } = require('express-validator');
const {Lead} = require("../models");
const { Op } = require("sequelize");

exports.createleadValidation = (req, res) => {
  return [
    body('project_id', 'Project Name is Required').notEmpty(),
    body('cre_user_id', 'CRE is Required').notEmpty(),
    body('sales_exec_user_id', 'Sales Executive is Required').notEmpty(),
    body('phone', 'Invalid Phone').notEmpty().isLength({ min: 10, max: 10 }).trim(),
    body('first_name', 'First name is Required').notEmpty().trim(),
    body('contactability','Contactability is Required').notEmpty(),
    body('remark','Remark is Required').notEmpty().trim(),
    body('phone').custom(async(value,{req}) => {
      return await Lead.findOne({where:{phone:value}}).then(lead => {
      if(lead){
          return Promise.reject('Phone number already exists.')
        }
      })
    })
  ]
}
exports.updateleadValidation = () => {
    return [
      body('phone').custom(async (value, { req }) => {
        return await Lead.findOne({
          where: {
            id : {
              [Op.ne]: req.params.leadId
            },
            phone: value,
          }
        })
          .then(lead => {
            if (lead) {
              return Promise.reject('Phone number already exists.')
            }
          })
      }),
    ]
  }