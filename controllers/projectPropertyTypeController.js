const { PropertyType, Project, Project_PropertyType, sequelize } = require("../models");

exports.getProjectPropertyType = async (req, res, next, id) => {
    try {
        const projectPropertyType = await Project_PropertyType.findByPk(id, {
            include: [
                {model: Project, attributes: ['id', 'name']}, 
                {model: PropertyType, attributes: ['id', 'name']}
            ]
        });
        if (projectPropertyType) {
            req.projectPropertyType = projectPropertyType;
            next();
        } else {
            throw "Project Property Type doesn's exists."
        }
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching Project Property Type.",
            error: error
        })
    }
}

exports.create = async (req, res)=> {
    try {
        await sequelize.transaction(async (t) => {
            let projectPropertyType = [];
            for (let i = 0; i < req.body.propertyType_id.length; i++) {
                projectPropertyType[i] = await Project_PropertyType.create({
                    "project_id": req.body.project_id,
                    "propertyType_id": req.body.propertyType_id[i]
                }, { transaction: t });            
            }

            return res.status(200).json({
                success: true,
                message: "Project Property Type association created.",
                projectPropertyType: projectPropertyType
            })     
        })   
        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Project Property Type association failed.",
            error: error
        })
    }
}

exports.findById = async (req, res)=> {
    try {
        return res.status(200).json({
            success: true,
            message: "Project Property Type fetched successfullly.",
            projectPropertyType: req.projectPropertyType
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching Project Property Type.",
            error: error
        })
    }
}

exports.findAll = async (req, res)=> {
    try {
        const projectPropertyTypes = await Project_PropertyType.findAll({
            include: [
                {model: Project, attributes: ['id', 'name']}, 
                {model: PropertyType, attributes: ['id', 'name']}
            ],
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "Project Property Types fetched successfullly.",
            projectPropertyTypes: projectPropertyTypes
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error fetching Project Property Types.",
            error: error
        })
    }
}

exports.delete = async (req, res)=> {
    try {
        const projectPropertyType = await Project_PropertyType.destroy({where: {id: req.params.projectPropertyTypeId}});

        return res.status(200).json({
            success: true,
            message: "Project Property Type association deleted.",
            projectPropertyType: projectPropertyType
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting Project Property Type association.",
            error: error
        })
    }
}