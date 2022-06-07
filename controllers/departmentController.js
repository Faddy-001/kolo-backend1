const { Department, Project, User } = require("../models");

// Fetch department by parameter
exports.getDepartment = async (req, res, next, id) => {
    try {
        const department = await Department.findByPk(id, { include: [{ model: Project, attributes: ['id', 'name'] }] });
        if (department) {
            req.department = department;
            next();
        } else {
            throw "Department does not exists.";
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Department does not exists.",
            error: error
        })
    }
}

// Creating a new Department
exports.create = async (req, res) => {
    try {
        const department = await Department.create(req.body);
        return res.status(200).json({
            success: true,
            message: "Department created successfully.",
            department: department
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error creating Department.",
            error: error
        })
    }
}



// To fetch all the departments
exports.findAll = async (req, res) => {
    try {


        const departments = await Department.findAll({
            include: [
                { model: Project, attributes: ['id', 'name'] }],
            order: [['created_at', 'DESC']],

        });

        return res.status(200).json({
            success: true,
            message: "All Departments fetched successfully.",
            department: departments,

        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching departments.",
            error: error
        })
    }
}

// To fetch Department by Id
exports.findById = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Department fetched successfully.",
            department: req.department
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching the department.",
            error: error
        })
    }
}

// Update Department by Id
exports.update = async (req, res) => {
    try {
        const department = await Department.update(req.body, { where: { id: req.params.departmentId }, returning: true, plain: true });
        console.log(department)
        return res.status(200).json({
            success: true,
            message: "Department updated successfully.",
            department: department
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error updating the department.",
            error: error
        })
    }
}

// Deleting the Department
exports.delete = async (req, res) => {
    try {
        const department = await Department.destroy({ where: { id: req.params.departmentId } });
        return res.status(200).json({
            success: true,
            message: "Department deleted successfully.",
            department: department
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting the department.",
            error: error
        })
    }
}