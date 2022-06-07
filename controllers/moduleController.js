const { Feature,Module } = require("../models");

// Fetch Feature by parameter
exports.getModuler = async (req, res, next, id)=> {
    try {
        const moduler = await Module.findByPk(id,{include: [{model:Feature,attributes:['id','name']}]},{raw:true});
        req.moduler = moduler;
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Module does not exists.",
            error: error
        })
    }
}

// Creating a new Feature
exports.create = async (req, res) => {
    try {
        const moduler = await Module.create(req.body);
        return res.status(200).json({
            success: true,
            message: "Module created successfully.",
            moduler: moduler
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error creating Feature.",
            error: error
        })
    }
}



// To fetch all the Features
exports.findAll = async (req, res)=> {
    try {
        
            
        const modules= await Module.findAll({
            include: [ {model:Feature}]
        
       });
        return res.status(200).json({
            success: true,
            message: "All Module fetched successfully.",
            modules: modules,

        })    
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching Features.",
            error: error
        })
    }
}

// To fetch Feature by Id
exports.findById = async (req, res)=> {
    try {
        return res.status(200).json({
            success: true,
            message: "Feature fetched successfully.",
            moduler: req.moduler
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching the feature.",
            error: error
        })
    }
}

// Update Feature by Id
exports.update = async (req, res)=> {
    try {
        const moduler = await Module.update(req.body,{where: {id: req.params.modulerId}, returning: true, plain: true });
        console.log(moduler)
        return res.status(200).json({
            success: true,
            message: "Feature updated successfully.",
            moduler: moduler
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error updating the Feature.",
            error: error
        })
    }
}

// Deleting the Feature
exports.delete = async (req, res)=> {
    try {
        const moduler = await Module.destroy({ where: {id: req.params.modulerId}});
        return res.status(200).json({
            success: true,
            message: "Feature deleted successfully.",
            moduler: moduler
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting the Feature.",
            error: error
        })
    }
}