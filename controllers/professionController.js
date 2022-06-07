const { Profession } = require('../models');

exports.getProfession = async (req, res, next, id) => {
    try {
        const profession = await Profession.findByPk(id);
        req.profession = profession;
        if (profession) {
            req.profession = profession;
            next();
        }else{
            throw "Profession does not exists.";
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Profession does not exists.",
            error: error
        })
    }
}

exports.create = async (req, res) => {
    try {
        const profession = await Profession.create(req.body);
        return res.status(200).json({
            success: true,
            message: "Profession created successfully.",
            profession: profession
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Profession creation failed.",
            error: error
        })
    }
}

exports.findById = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Profession fetched successfully.",
            profession: req.profession
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching the Profession.",
            error: error
        })
    }
}

exports.findAll = async (req, res) => {
    try {
        const professions = await Profession.findAll({
            order: [['created_at', 'DESC']]
        });
        return res.status(200).json({
            success: true,
            message: "Professions fetched successfully.",
            professions: professions
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error fetching Professions.",
            error: error
        })
    }
}

exports.update = async (req, res) => {
    try {
        const profession = await Profession.update(req.body, { where: { id: req.params.professionId } });
        if (profession[0]) {
            return res.status(200).json({
                success: true,
                message: "Profession updated successfully.",
                profession: profession
            })
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error updating the Profession.",
            error: error
        })
    }
}

exports.delete = async (req, res) => {
    try {
        const profession = await Profession.destroy({ where: { id: req.params.professionId } })
        return res.status(200).json({
            success: true,
            message: "Profession deleted successfully.",
            profession: profession
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting the Profession.",
            error: error
        })
    }
}