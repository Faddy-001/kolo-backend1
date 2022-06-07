const { Pre_Booking, Offer, Project, PropertyType, Property, Image, sequelize } = require('../models');
const { Op } = require("sequelize");

exports.getPreBooking = async (req, res, next, id) => {
    try {
        const preBooking = await Pre_Booking.findByPk(id, {include: [
            {model: Property, include: [
                {model: Project, attributes: ['id', 'name']},
                {model: PropertyType, attributes: ['id', 'name']}
            ]},
            {model: Image}
        ]});
        if (preBooking) {
            if (preBooking.offer != (false || null)) {
                var offers= [];
                preBooking.offer = preBooking.offer.split(",").map(x=>+x)
                for (let i = 0; i < preBooking.offer.length; i++) {
                    let offer = await Offer.findByPk(preBooking.offer[i]);
                    offers.push({'id': offer.id, 'name': offer.name, 'benefit': offer.benefit});
                }
                preBooking.offer = offers;
            }            
            req.preBooking = preBooking;
            next();
        } else {
            throw "Pre Booking doesn't exists."
        }
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching Pre Booking.",
            error: error
        })
    }
}

exports.create = async (req, res) => {
    try {
        await sequelize.transaction(async (t) => {
            req.body.offer =  req.body.offer ? req.body.offer.toString() : null;
            const preBooking = await Pre_Booking.create(req.body, { transaction:t });
   
            if (req.files && req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    let image_values = {
                        image_type: req.files[i].fieldname,
                        title:req.files[i].originalname,
                        src:req.files[i].path,
                        mime_type:req.files[i].mimetype
                    }
                    image = await preBooking.createImage(image_values, { transaction:t });
                }                
            }

            Property.update({status: 'Pre Booked'}, { where: {id: req.body.property_id}}, { transaction:t });

            return res.status(200).json({
                success: true,
                message: "Pre Booking Stage created successfully.",
                preBooking: preBooking
            })
        })                
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Pre Booking Stage creation failed.",
            error: error
        })
    }
}

exports.findById = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Pre Booking fetched successfully.",
            preBooking: req.preBooking
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching Pre Booking.",
            error: error
        })
    }
}

exports.findAll = async (req, res)=> {
    try {
        const preBookings = await Pre_Booking.findAll();

        for (let i = 0; i < preBookings.length; i++) {
            if (preBookings[i].offer != (false || null)) {
                var offers= [];
                preBookings[i].offer = preBookings[i].offer.split(",").map(x=>+x)
                for (let j = 0; j < preBookings[i].offer.length; j++) {                    
                    let offer = await Offer.findByPk(preBookings[i].offer[j]);
                    offers.push({'id': offer.id, 'name': offer.name, 'benefit': offer.benefit});                             
                }
                preBookings[i].offer = offers;
            }            
        }
        return res.status(200).json({
            success: true,
            message: "Pre Bookings fetched successfully.",
            preBookings: preBookings
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error fetching Pre Bookings.",
            error: error
        })
    }
}

exports.update = async (req, res) => {
    try {
        await sequelize.transaction(async (t) => {
            const preBooking = await Pre_Booking.update(req.body, { where: {id: req.params.preBookingId}}, { transaction:t });

            if (req.files && req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    let image_values = {
                        imageable_type: 'Pre_Booking',
                        imageable_id: req.params.preBookingId,
                        image_type: req.files[i].fieldname,
                        title:req.files[i].originalname,
                        src:req.files[i].path,
                        mime_type:req.files[i].mimetype
                    }
                    image = await Image.create(image_values, { transaction:t });
                }                
            }

            return res.status(200).json({
                success: true,
                message: "Pre Booking updated successfully.",
                preBooking: preBooking
            })
        })        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error updating the Pre Booking.",
            error: error
        })
    }
}

exports.delete = async (req, res) => {
    try {
        await sequelize.transaction(async (t) => {
            const preBooking = await Pre_Booking.destroy({ where: {id: req.params.preBookingId}}, { transaction:t });
            Property.update({status: 'Stock'}, { where: {id: req.body.property_id}}, { transaction:t });

            return res.status(200).json({
                success: true,
                message: "Pre Booking deleted successfully.",
                preBooking: preBooking
            })
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting the Pre Booking.",
            error: error
        })
    }
}

exports.discard = async (req,res)=> {
    try {
        await sequelize.transaction(async (t) => {
            const preBooking = await Pre_Booking.update({is_discarded: true},{ where: {id: req.params.preBookingId}}, {transaction: t});
            Property.update({status: 'Stock'}, { where: {id: req.body.property_id}}, { transaction:t });
            
            return res.status(200).json({
                success: true,
                message: "Pre Booking discarded successfully.",
                preBooking: preBooking
            })
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error discarding the Pre Booking.",
            error: error
        })
    }
}

exports.deleteFile = async (req,res)=> {
    try {
        let deletedFile = 0;
        for (let i = 0; i < req.body.length; i++) {
            deletedFile = await Image.destroy({
                where: {
                    imageable_type: 'Pre_Booking',
                    imageable_id: req.params.preBookingId,
                    src: req.body[i].url
                }
            })            
        }

        if (deletedFile != 0) {
            return res.status(200).json({
                success: true,
                message: "Files deleted successfully."
            })
        }
        else {
            return res.status(400).json({
                success: false,
                message: "Error deleting files."
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error deleting files."
        })
    }
}