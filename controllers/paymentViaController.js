const { Payment_Via } = require("../models");

exports.getPaymentVia= async (req, res, next, id)=> {
    try {
        const paymentVia= await Payment_Via.findByPk(id);
        if(paymentVia) {
            req.paymentVia= paymentVia;
            next();
        } else {
            throw "Payment Via doesn't exists."
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Payment Via doesn't exists.",
            error: error
        })
    }
}

exports.create= async (req, res)=> {
    try {
        const paymentVia= await Payment_Via.create(req.body);

        return res.status(200).json({
            success: true,
            message: "Payment Via created successfully.",
            paymentVia: paymentVia
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error creating Payment Via.",
            error: error
        })
    }
}

exports.findById= async (req, res)=> {
    try {
        return res.status(200).json({
            success: true,
            message: "Payment Via fetched successfully.",
            paymentVia: req.paymentVia
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Error fetching Payment Via.",
            error: error
        })
    }
}

exports.findAll= async (req, res)=> {
    try {
        const paymentVia= await Payment_Via.findAll({order: [['created_at', 'DESC']]});
        return res.status(200).json({
            success: true,
            message: "All Payment Via fetched successfully.",
            paymentVia: paymentVia
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Error fetching Payment Via.",
            error: error
        })
    }
}

exports.update= async (req,res)=> {
    try {
        const paymentVia= await Payment_Via.update(req.body, {where: {id: req.params.paymentViaId}});

        return res.status(200).json({
            success: true,
            message: "Payment Via updated successfully.",
            paymentVia: paymentVia
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Error updating Payment Via.",
            error: error
        })
    }
}

exports.delete= async(req,res)=>{
    try {
        const paymentVia= await Payment_Via.destroy({where: {id: req.params.paymentViaId}});
        return res.status(200).json({
            success: true,
            message: "Payment Via deleted successfully.",
            paymentVia: paymentVia
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:"Error deleting Payment Via.",
            error: error
        })
    }
}