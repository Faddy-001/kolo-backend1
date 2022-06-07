const { Feature, Role, User, Module_Permission, Module_Feature, Module, Feature_Access_Permission, sequelize } = require("../models")
const { Op, where } = require("sequelize");

// Fetch role by parameter id
exports.getRole = async (req, res, next, id) => {
    try {
        const role = await Role.findByPk(id,
            { include: [
                { model: Module_Permission }, 
                { model: Feature_Access_Permission, include: [
                    { model: Feature, include: [
                        { model: Module, attributes: ['id', 'name'] }
                    ], attributes: ['id', 'name']}, 
                ]}
            ] });

        if (role) {
            req.role = role;
            next();
        } else {
            throw "Role does not exists"
        }
    } catch (error) {

        return res.status(400).json({
            success: false,
            message: "Role does not exists.",
            error: error
        })
    }
}

// To create a new Role
exports.create = async (req, res) => {
    try {
        await sequelize.transaction(async (t) => {
            let roleDetails = {
                name: req.body.name,
                description: req.body.description
            };

            const role = await Role.create(roleDetails, { transaction: t });

            req.body.modulePermission.role_id = role.id;
            const modulePermission = await Module_Permission.create(req.body.modulePermission, { transaction: t });

            let featureAccessPermissions = [];
            
            for (let i = 0; i < req.body.featureAccessPermission.length; i++) {
                req.body.featureAccessPermission[i].feature_id = req.body.featureAccessPermission[i].id;
                delete req.body.featureAccessPermission[i].id; 
                req.body.featureAccessPermission[i].role_id = role.id;
                let featureAccessPermission = await Feature_Access_Permission.create(req.body.featureAccessPermission[i], { transaction: t });
                featureAccessPermissions.push(featureAccessPermission);
            };
            
            return res.status(200).json({
                success: true,
                message: "Role with Permission created successfully.",
                role: role,
                modulePermission: modulePermission,
                featureAccessPermissions: featureAccessPermissions
            })
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error creating the role.",
            error: error
        })
    }
}

// Fetch all the Roles
exports.findAll = async (req, res) => {
    try {
        let where = { name: {[Op.notIn]: ['Super Admin']} }
        if (req.profile.Role.name == 'Super Admin') {
            where = {}
        }

        const roles = await Role.findAll({where: where, order: [['created_at', 'DESC']]});
        
        return res.status(200).json({
            success: true,
            message: "Roles fetched successfully.",
            role: roles
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error fetching the roles.",
            error: error
        })
    }
}

// Fetch Role by id
exports.findById = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Role fetched successfully.",
            role: req.role
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching the role.",
            error: error
        })
    }
}


exports.update = async (req, res) => {
    try {

        await sequelize.transaction(async (t) => {
            let modulePermission
            let featureAccessPermission
            let featureAccessPermissions = [];
            let roleDetails = {
                name: req.body.name,
                description: req.body.description
            };
            const role = await Role.update(roleDetails, { where: { id: req.params.roleId } }, { transaction: t });

            if (req.body.modulePermission) {
                modulePermission = await Module_Permission.update(req.body.modulePermission, { where: { 
                    role_id: req.params.roleId 
                } }, { transaction: t })
            }

            if (req.body.featureAccessPermission.length > 0) {
                await Feature_Access_Permission.destroy({ where: { role_id: req.params.roleId } });

                for (let i = 0; i < req.body.featureAccessPermission.length; i++) {
                    req.body.featureAccessPermission[i].feature_id = req.body.featureAccessPermission[i].id;
                    delete req.body.featureAccessPermission[i].id;
                    req.body.featureAccessPermission[i].role_id = req.params.roleId; 
                    featureAccessPermission = await Feature_Access_Permission.create(req.body.featureAccessPermission[i], { transaction: t });                    
                    featureAccessPermissions.push(featureAccessPermission);
                }
            }
            return res.status(200).json({
                success: true,
                message: "Role updated successfully",
                role: role,
                modulePermission: modulePermission,
                featureAccessPermissions: featureAccessPermissions
            });
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Role updation failed",
            error: error
        })

    }
}

// Delete Role by id
exports.delete = async (req, res) => {
    try {
        const role = await Role.destroy({ where: { id: req.params.roleId } });
        return res.status(200).json({
            success: true,
            message: "Role deleted successfully.",
            role: role
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting the role.",
            error: error
        })
    }
}