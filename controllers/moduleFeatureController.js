const { Module, Feature, Module_Feature, sequelize } = require("../models");

exports.getModuleFeature = async (req, res, next, id) => {
    try {
        const modulefeature = await Module_Feature.findByPk(id, {
            include: [
                {model: Module, attributes: ['id', 'name']}, 
                {model: Feature, attributes: ['id', 'name']}
            ]
        });
        if (modulefeature) {
            req.modulefeature = modulefeature;
            next();
        } 
        else {
            throw "Module Feature  doesn't exists."
        }
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching Module Feature.",
            error: error
        })
    }
}

exports.create = async (req, res)=> {
    try {
        await sequelize.transaction(async (t) => {
            let modulefeatures = [];
            for (let i = 0; i < req.body.feature_id.length; i++) {
                modulefeatures[i] = await Module_Feature.create({
                    "module_id": req.body.module_id,
                    "feature_id": req.body.feature_id[i],
                    "path":req.body.path
                }, { transaction: t });            
            }

            return res.status(200).json({
                success: true,
                message: "Module Feature association created.",
                modulefeatures: modulefeatures
            })     
        })   
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Module Feature association failed.",
            error: error
        })
    }
}

exports.findById = async (req, res)=> {
    try {
        return res.status(200).json({
            success: true,
            message: "modulefeature fetched successfullly.",
            modulefeature: req.modulefeature
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching modulefeature.",
            error: error
        })
    }
}

exports.findAll = async (req, res)=> {
    try {
        const modulefeature = await Module_Feature.findAll({
            include: {model: Module, 
                        include: [
                            {model: Feature, attributes: ['id', 'name']}
                        ],attributes: ['id', 'name']}                
        });

        return res.status(200).json({
            success: true,
            message: "modulefeature fetched successfullly.",
            modulefeature: modulefeature
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error fetching modulefeature.",
            error: error
        })
    }
}

exports.delete = async (req, res)=> {
    try {
        const modulefeature = await Module_Feature.destroy({where: {id: req.params.moduleFeatureId}});

        return res.status(200).json({
            success: true,
            message: "modulefeature association deleted.",
            modulefeature: modulefeature
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting modulefeature.",
            error: errors
        })
    }
}