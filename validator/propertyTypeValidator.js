const { body, validationResult } = require('express-validator');
const { PropertyType } = require("../models");
const { Op } = require("sequelize");

exports.createPropertyTypeValidation = (req, res) => {
  return [
    body('name', 'Property Type Name is Required').notEmpty().trim(),
    //body('description', 'description is Required').notEmpty(),
    body('name').custom(value => {
      return PropertyType.findOne({ where: { name: value } }).then(property => {
        var check = false;
        if (property) {
          check = true
        }
        if (check) {
          return Promise.reject('Property Type already in use.')
        }
      })
    })
  ]
}

// exports.updatePropertyTypeValidation = () => {
//   return [
//     body('name').custom((value,{req}) => {
//       return PropertyType.findOne({ where:
//        { id :
//         {
//           [Op.ne]: req.params.offerId
//         },
//         name:value},raw:true})
//         .then(property => {
//           if(property){
//             return Promise.reject('Name Already in use')
//           }
//       })

//       }),
//   ]
// }
///
exports.updatePropertyTypeValidation = () => {
  return [
    body('name').custom(async (value, { req }) => {
      return await PropertyType.findOne({
        where: {
          id :
         {
           [Op.ne]: req.params.propertyTypeId
         },
           name: value,
        }, raw: true
      })
        .then(propertyType => {
          if (propertyType) {
            return Promise.reject('Property Type already in use.')
          }
        })
    }),
  ]
}


