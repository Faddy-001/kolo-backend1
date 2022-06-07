const { Property, sequelize, Project, PropertyType, Image, Pre_Booking, Lead } = require('../models');
const {Op} = require('sequelize');
exports.getProperty = async (req,res,next,id)=> {
    try {
        const property= await Property.findByPk(id, {include: [
            {model:Project, attributes:['id', 'name']},
            {model:PropertyType, attributes:['id', 'name']},
            {model: Image},
            {model: Pre_Booking, include: [
                {model: Lead, attributes: ['id', 'first_name', 'middle_name', 'last_name', 'phone']}                
            ], attributes: ['id']}
        ]});
        if(property) {
            req.property = property;
            next();
        } else {
            throw "Property doesn't exists."
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Property doesn't exists.",
            error: error
        })
    }
}

exports.create= async (req,res)=> {
    try {
        await sequelize.transaction(async (t) => {
            let images=[];
            const property= await Property.create(req.body, { transaction:t });

            if(req.files && req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    let image_values = {
                        image_type: req.files[i].fieldname,
                        title:req.files[i].originalname,
                        src:req.files[i].path,
                        mime_type:req.files[i].mimetype
                    }
                    image = await property.createImage(image_values, { transaction:t });
                    images.push(image);
                }
            }

            return res.status(200).json({
                success: true,
                message: "Property created successfully.",
                property: property,
                images:images
            })
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error creating Property.",
            error: error
        })
    }
}

exports.findById= async (req,res)=> {
    try {
        return res.status(200).json({
            success: true,
            message: "Property fetched successfully.",
            property: req.property
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching Property.",
            error: error
        })
    }
}

exports.findAll= async (req,res)=> {
    try {
        let where = {};
        if (req.query.project) {
            where.project_id = req.query.project;
        }
        if (req.query.status) {
            where.status = req.query.status;
        }
        if (req.query.propertyType) {
            where.property_type_id = req.query.propertyType;
        }
        if (req.query.property) {
            where.number = { [Op.like]: '%' + req.query.property + '%' };
        }
        const properties= await Property.findAll({
            where, 
            include: [
            {model:Project, attributes:['id', 'name']},
            {model:PropertyType, attributes:['id', 'name']}
            ],
            order: [['created_at', 'DESC']]
        });
        return res.status(200).json({
            success: true,
            message: "Properties fetched successfully.",
            properties: properties
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching properties.",
            error: error
        })
    }
}

exports.update= async (req,res)=> {
    try {
        await sequelize.transaction(async (t) => {
            const property= await Property.update(req.body, {where: {id: req.params.propertyId}}, {transaction: t});

            if(req.files && req.files.length > 0) {
                for (let i = 0; i < req.files.length; i++) {
                    let image_values = {
                        imageable_type: 'Property',
                        imageable_id: req.params.propertyId,
                        image_type: req.files[i].fieldname,
                        title:req.files[i].originalname,
                        src:req.files[i].path,
                        mime_type:req.files[i].mimetype
                    }
                    image = await Image.create(image_values, { transaction:t });
                }
            }

            if(property[0]) {
                return res.status(200).json({
                    success: true,
                    message: "Property updated successfully.",
                    property: property
                })
            }
        })        
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error updating Property.",
            error: error
        })
    }
}

exports.delete= async (req,res)=> {
    try {
        const property= await Property.destroy({where: {id: req.params.propertyId}});

        return res.status(200).json({
            success: true,
            message: "Property Deleted.",
            property: property
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting the property.",
            error: error
        })
    }
}

exports.search = async (req,res)=> {
    try {
        let searchText = req.query.search;
        const properties = await Property.findAll({
            where: {
                [Op.and]: [
                    {
                        [Op.or]: [
                            {number:  { [Op.like]: '%' + searchText + '%' }},
                            {name: { [Op.like]: '%' + searchText + '%' }}
                        ]
                    },                    
                    {status: { [Op.eq]: 'Stock' }}
            ]},
            include: [
                {model:Project, attributes:['id', 'name']},
                {model:PropertyType, attributes:['id', 'name']}
            ]
        })

        return res.status(200).json({
            success: true,
            message: "Properties fetched successfully.",
            properties: properties
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error searching the propertyies.",
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
                    imageable_type: 'Property',
                    imageable_id: req.params.propertyId,
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
                message: "File to be deleted doesn't exists."
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