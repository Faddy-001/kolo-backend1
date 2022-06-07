const { Role, Module_Permission } = require("../models");

// Fetch Module Permission by parameter
exports.getPermission = async (req, res, next, id) => {
    try {
        const permissions = await Module_Permission.findByPk(id, { include: [{ model: Role, attributes: ['id', 'name'] }] });
        req.permissions = permissions;
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Permission does not exists.",
            error: error
        })
    }
}

// Creating a New Module Permission
exports.create = async (req, res) => {
    try {
      //   req.body.role_id = req.body.role_id ? req.body.role_id.toString() : 2;
        const permissions = await Module_Permission.create(req.body);
        return res.status(200).json({
            success: true,
            message: "permissions created successfully.",
            permissions: permissions
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



// To fetch all the Module Permission
exports.findAll = async (req, res) => {
    try {
        const permissions = await Module_Permission.findAll({
            include: [
                { model: Role }],
        });

        return res.status(200).json({
            success: true,
            message: "All Permission fetched successfully.",
            permissions: permissions,

        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching Permissions.",
            error: error
        })
    }
}

// To fetch ModulePermission by Id
exports.findById = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Permission fetched successfully.",
            Permission: req.permissions
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching the Permissions.",
            error: error
        })
    }
}

