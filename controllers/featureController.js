const { Feature,Module } = require("../models");

// Fetch Feature by parameter
exports.getFeature = async (req, res, next, id)=> {
    try {
        const feature= await Feature.findByPk(id, { include: [{model:Module,attributes:['id','name']}] });
        req.feature= feature;
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Feature does not exists.",
            error: error
        })
    }
}

// Creating a new Feature
exports.create = async (req, res)=> {
    try {
        const feature = await Feature.create(req.body);
        return res.status(200).json({
            success: true,
            message: "Feature created successfully.",
            feature: feature
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
        
            
        const features = await Feature.findAll({
            include: [ 
                {model:Module,attributes:['id','name']}],
            
        
       });

        return res.status(200).json({
            success: true,
            message: "All Features fetched successfully.",
            feature: features,

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
            feature: feature
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
        const feature = await Feature.update(req.body,{where: {id: req.params.featureId}, returning: true, plain: true });
        console.log(feature)
        return res.status(200).json({
            success: true,
            message: "Feature updated successfully.",
            feature: feature
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
        const feature = await Feature.destroy({ where: {id: req.params.featureId}});
        return res.status(200).json({
            success: true,
            message: "Feature deleted successfully.",
            feature: feature
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting the Feature.",
            error: error
        })
    }
}