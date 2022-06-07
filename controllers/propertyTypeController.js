const { PropertyType, Project, Project_PropertyType } = require("../models");

exports.getPropertyType = async (req, res, next, id) => {
    try {
        const propertyType = await PropertyType.findByPk(id, { include: [{model:Project,attributes:['id','name']}] });
        if(propertyType){
            req.propertyType = propertyType;
            next();
        }else{
              throw "Property Type does not exists."
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Property Type does not exists.",
            error: error
        })
    }
}

exports.create = async (req, res) => {
    try {
        const propertyType = await PropertyType.create(req.body);
        
        return res.status(200).json({
            success: true,
            message: "Property Type created successfully.",
            propertyType: propertyType
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Property Type creation failed.",
            error: error
        })
    }
}

exports.findById = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Property Type fetched successfully.",
            propertyType: req.propertyType
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching Property Type.",
            error: error
        })
    }
}

exports.findAll = async (req, res) => {
    try {
        const propertyTypes = await PropertyType.findAll({
            include: [ 
                {model:Project,attributes:['id','name']}],
            order: [ ['created_at', 'DESC'] ]
        });
        return res.status(200).json({
            success: true,
            message: "Property Types fetched successfully.",
            propertyTypes: propertyTypes
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching Property Types.",
            error: error
        })
    }
}

exports.update = async (req, res) => {
    try {
        const propertyType = await PropertyType.update(req.body, { where: { id: req.params.propertyTypeId } });
          
        return res.status(200).json({
            success: true,
            message: "Property Type updated successfully.",
            propertyType: propertyType
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error updating Property Type.",
            error: error
        })
    }
}

exports.delete = async (req, res) => {
    try {
        const propertyType = await PropertyType.destroy({ where: {id: req.params.propertyTypeId}});
        return res.status(200).json({
            success: true,
            message: "Property Type deleted successfully.",
            propertyType: propertyType
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting Property Type.",
            error: error
        })
    }
}

exports.removeProject = async (req, res) => {
    try {
        const propertyType = await Project_PropertyType.destroy({where: {project_id: req.body.project_id, propertyType_id: req.params.propertyTypeId}});

        return res.status(200).json({
            success: true,
            message: "Project separated from this Property Type.",
            propertyType: propertyType
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error Project separation from this Property Type.",
            error: error
        })
    }
}