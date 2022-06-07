const { Offer, Project, PropertyType, Property, sequelize } = require("../models");
const randnum = require('random-number');
const { QueryTypes } = require('sequelize');
const moment = require('moment');
const cron = require('node-cron');

exports.getOffer = async (req, res, next, id) => {
    try {
        const offer = await Offer.findByPk(id, {
            include: [{
                model: Project,
                as: 'applicable_on_project', attributes: ['id', 'name']
            }]
        });
        offer.applicable_on_payment_type ? offer.applicable_on_payment_type = offer.applicable_on_payment_type.split(",").map(x => x) : null;
        offer.applicable_on_property ? offer.applicable_on_property = offer.applicable_on_property.split(",").map(x => +x) : null;
        offer.applicable_on_property_type ? offer.applicable_on_property_type = offer.applicable_on_property_type.split(",").map(x => +x) : null;
        req.offer = offer;

        if (req.offer.applicable_on_property_type != (false || null)) {
            var propertyTypes = [];
            for (var i = 0; i < req.offer.applicable_on_property_type.length; i++) {
                let propertyTypeData = await PropertyType.findByPk(req.offer.applicable_on_property_type[i])
                propertyTypes.push({ 'id': propertyTypeData.id, 'name': propertyTypeData.name });
            }
            req.offer.applicable_on_property_type = propertyTypes;
        }
        if (req.offer.applicable_on_property != (false || null)) {
            var properties = [];
            for (var i = 0; i < req.offer.applicable_on_property.length; i++) {
                let propertyData = await Property.findByPk(req.offer.applicable_on_property[i])
                properties.push({ 'id': propertyData.id, 'name': propertyData.name, 'number': propertyData.number });
            }
            req.offer.applicable_on_property = properties;
        }




        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Offer does not exists.",
            error: error
        })
    }
}

exports.create = async (req, res) => {
    try {
        req.body.start_date == "" ? req.body.start_date = null : req.body.start_date;
        req.body.end_date == "" ? req.body.end_date = null : req.body.end_date;
        req.body.counts == 0 ? req.body.counts = null : req.body.counts;
        req.body.applicable_on_project_id == "" ? req.body.applicable_on_project_id = null : req.body.applicable_on_project_id;

        if (req.body.applicable_on_payment_type) {
            req.body.applicable_on_payment_type = req.body.applicable_on_payment_type.toString();
        }
        if (req.body.applicable_on_property_type) {
            req.body.applicable_on_property_type = req.body.applicable_on_property_type.toString();
        }
        if (req.body.applicable_on_property) {
            req.body.applicable_on_property = req.body.applicable_on_property.toString();
        }
        let number = randnum.generator({ min: 111, max: 999, integer: true });
        req.body.number = "#" + number();

        const offer = await Offer.create(req.body);

        return res.status(200).json({
            success: true,
            message: "Offer created successfully.",
            offer: offer
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error creating an Offer.",
            error: error
        })
    }
}

exports.findOne = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Offer fetched successfully.",
            offer: req.offer
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error fetching the Offer.",
            error: error
        })
    }
}

exports.findAll = async (req, res) => {
    try {
        const offers = await Offer.findAll({
            include: [{
                model: Project,
                as: 'applicable_on_project', attributes: ['id', 'name']
            }],
            order: [['created_at', 'DESC']]
        });
        for (var i = 0; i < offers.length; i++) {
            offers[i].applicable_on_payment_type ? offers[i].applicable_on_payment_type = offers[i].applicable_on_payment_type.split(",").map(x => x) : null;
            offers[i].applicable_on_property ? offers[i].applicable_on_property = offers[i].applicable_on_property.split(",").map(x => +x) : null;
            offers[i].applicable_on_property_type ? offers[i].applicable_on_property_type = offers[i].applicable_on_property_type.split(",").map(x => +x) : null;

            if (offers[i].applicable_on_property != (false || null)) {
                var properties = [];
                for (var j = 0; j < offers[i].applicable_on_property.length; j++) {
                    let propertyData = await Property.findByPk(offers[i].applicable_on_property[j])
                    properties.push({ 'id': propertyData.id, 'name': propertyData.name, 'number': propertyData.number });
                }
                offers[i].applicable_on_property = properties;
            }
            if (offers[i].applicable_on_property_type != (false || null)) {
                var propertyTypes = [];
                for (var j = 0; j < offers[i].applicable_on_property_type.length; j++) {
                    let propertyTypeData = await PropertyType.findByPk(offers[i].applicable_on_property_type[j])
                    propertyTypes.push({ 'id': propertyTypeData.id, 'name': propertyTypeData.name });
                }
                offers[i].applicable_on_property_type = propertyTypes;
            }
        };

        return res.status(200).json({
            success: true,
            message: "Offers fetched successfully.",
            offers: offers
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error fetching Offers.",
            error: error
        })
    }
}

exports.update = async (req, res) => {
    try {


        req.body.start_date == "" ? req.body.start_date = null : req.body.start_date;
        req.body.end_date == "" ? req.body.end_date = null : req.body.end_date;
        req.body.counts == 0 ? req.body.counts = null : req.body.counts;
        req.body.applicable_on_project_id == "" ? req.body.applicable_on_project_id = null : req.body.applicable_on_project_id;





        if (req.body.applicable_on_payment_type) {
            req.body.applicable_on_payment_type = req.body.applicable_on_payment_type.toString();
        }
        if (req.body.applicable_on_property_type) {
            req.body.applicable_on_property_type = req.body.applicable_on_property_type.toString();
        }
        if (req.body.applicable_on_property) {
            req.body.applicable_on_property = req.body.applicable_on_property.toString();
        }
        const offer = await Offer.update(req.body, { where: { id: req.params.offerId }, individualHooks: true });

        return res.status(200).json({
            success: true,
            message: "Offer updated successfully.",
            offer: offer
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error updating the Offer.",
            error: error
        })
    }
}

exports.delete = async (req, res) => {
    try {
        const offer = await Offer.destroy({ where: { id: req.params.offerId } });

        return res.status(200).json({
            success: true,
            message: "Offer deleted successfully.",
            offer: offer
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting the Offer.",
            error: error
        })
    }
}

exports.applicableOffers = async (req, res) => {
    try {
        const property = await Property.findByPk(req.query.propertyId);
        let project = property.project_id;
        let propertyType = property.property_type_id;
        let paymentType = req.query.paymentType;
        let currentDate = moment().format();

        let sql = ("SELECT * FROM `offers` WHERE (? > `start_date` OR `start_date` IS NULL) AND (? < `end_date` OR `end_date` IS NULL) AND (counts > 0 OR counts IS NULL) AND (applicable_on_project_id = ? OR applicable_on_project_id IS NULL) AND (applicable_on_payment_type IS NULL OR applicable_on_payment_type = ?) AND (FIND_IN_SET(?, applicable_on_property_type) OR applicable_on_property_type IS NULL) AND (FIND_IN_SET(?, applicable_on_property) OR applicable_on_property IS NULL) ORDER BY `id` ASC");

        const offers = await sequelize.query(sql, {
            replacements: [currentDate, currentDate, project, paymentType, propertyType, property.id],
            type: QueryTypes.SELECT
        })

        return res.status(200).json({
            success: true,
            message: "Applicable offers fetched successfully.",
            offers: offers
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetchting applicable Offers.",
            error: error
        })
    }
}

exports.expireDate = async (req, res) => {
    //Offer.update({is_expired:1}, { where: {id: req.body.property_id}}, { transaction:t });
    sequelize.query("update offers set is_expired=1 where date(end_date)< CURRENT_DATE()")
    console.log("expireDate");
}

