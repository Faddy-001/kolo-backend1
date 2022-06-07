const { Role, Feature, Module_Feature, Module, Feature_Access_Permission} = require("../models");

// Fetch Module Permission by parameter
exports.getAccessPermission = async (req, res, next, id) => {
    try {
        const accessPermissions = await Feature_Access_Permission.findByPk(id, {
            include: [{model: Feature, include: [
                {model: Module, attributes: ['id', 'name']}
            ], attributes: ['id', 'name']}]
        });
        req.accessPermissions = accessPermissions;
        next();
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Access Permission does not exists.",
            error: error
        })
    }
}

// Creating a New Module Permission
exports.create = async (req, res) => {
    try {

        // req.body.role_id = req.body.role_id ? req.body.role_id.toString() : 2;
        // req.body.feature_id = req.body.feature_id ? req.body.feature_id.toString() : 0;
        const accessPermissions = await Feature_Access_Permission.create(req.body);
        return res.status(200).json({
            success: true,
            message: "permissions created successfully.",
            permissions: accessPermissions
        })
    } catch (error) {
        console.log(error); 
        return res.status(400).json({
            success: false,
            message: "Error creating permissions.",
            error: error
        })
    }
}



// To fetch all the Feature Access Permission
exports.findAll = async (req, res) => {
    try {
        const accesspermission = await Feature_Access_Permission.findAll({
            include: [
                { model: Role} ,{model:Feature}],
        });

        return res.status(200).json({
            success: true,
            message: "All Permission fetched successfully.",
            permissions: accesspermission,

        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching Permissions.",
            error: error
        })
    }
}

// To fetch Feature Access by Id
exports.findById = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Permission fetched successfully.",
            Permission: req.accessPermissions
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching the Permissions.",
            error: error
        })
    }
}

