const { User, Feature, User_Permission, Module_Permission } = require("../models");

// Fetch Module Permission by parameter
exports.getAccessPermission = async (req, res, next, id) => {
    try {
        const accessUserPermissions = await User_Permission.findByPk(id, { include: [{ model: User, attributes: ['id', 'name'] }, { model: Feature, attributes: ['id', 'name'] }, { model: Module_Permission }] });
        req.accessUserPermissions = accessUserPermissions;
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
       // req.body.user_id = req.body.user_id ? req.body.user_id.toString() : 0;
        //req.body.feature_id = req.body.feature_id ? req.body.feature_id.toString() : 0;
        let userPermission = [];
        if(req.body.userPermission){
            for(let i=0; i < req.body.userPermission.length; i++){
                let userpermissiondetails = {
                    user_id: req.body.user_id,
                    feature_id: req.body.userPermission[i].feature_id,
                    create: req.body.userPermission[i].create,
                    read: req.body.userPermission[i].read,
                    update: req.body.userPermission[i].update,
                    delete: req.body.userPermission[i].delete,
                    fullAccess: req.body.userPermission[i].fullAccess,
                    

                }
                let accessUserPermissions = await User_Permission.create(userpermissiondetails);
                userPermission.push(accessUserPermissions);
            }
        }
        //const accessUserPermissions = await User_Permission.create(req.body);
        
        return res.status(200).json({
            success: true,
            message: "permissions created successfully.",
            userpermissions: userPermission
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
        const accessUserPermissions = await User_Permission.findAll({
            include: [
                { model: User }, { model: Feature }],
        });

        return res.status(200).json({
            success: true,
            message: "All Permission fetched successfully.",
            userpermissions: accessUserPermissions,

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
            userPermission: req.accessUserPermissions
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching the Permissions.",
            error: error
        })
    }
}

