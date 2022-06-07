const { body } = require('express-validator');
const { Offer } = require("../models");
const { Op } = require("sequelize");
exports.createOfferValidation = (req, res) => {
  return [
    body('name', 'Offer Name is Required').notEmpty(),
    body('type', 'Offer Type is Required').notEmpty(),
    body('benefit', 'benefit is Required').notEmpty(),
    body('name').custom(async (value, { req }) => {
      return await Offer.findOne({ where: { name: value, applicable_on_project_id: req.body.applicable_on_project_id?req.body.applicable_on_project_id:"" }, raw: true }).then(offer => {
        if (offer) {
          return Promise.reject('Offer Already in use')
        }
      })
    })
  ]
}

exports.updateOfferValidation = () => {
  return [
    body('name').custom(async (value, { req }) => {
      return offers = await Offer.findOne({
        where:
        {
          id: {
            [Op.ne]: req.params.offerId
          },
          name: value,
          applicable_on_project_id: req.body.applicable_on_project_id
        }, raw: true
      }).then(offers => {
        if (offers) {
          return Promise.reject('Name Already Taken')
        }
      })
    })
  ]
}

