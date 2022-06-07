const { Project, Department, User, PropertyType, Offer } = require("../models");

// Fetch Project
exports.getProject = async (req, res, next, id) => {
    try {
        const project = await Project.findByPk(id, {
            include: [
                { model: PropertyType, attributes: ['id', 'name'] },
                { model: Department, attributes: ['id', 'name'] }]
        });
        if (project) {
            req.project = project;
            next();

        } else {
            throw "Project doesn't exist."
        }
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Project does not exists."
        })
    }
}
// Create a new Project
exports.create = async (req, res) => {
    try {
        const project = await Project.create(req.body);
        return res.status(200).json({
            success: true,
            message: "Project created successfully.",
            project: project
        })
    }
    catch (error) {

        return res.status(400).json({
            success: false,
            message: "Project creation failed.",
            error: error
        })
    }
}

exports.findAll = async (req, res) => {
    try {
        const projects = await Project.findAll({
            include: [
                { model: PropertyType, attributes: ['id', 'name'] },
                { model: Department, attributes: ['id', 'name'] },
            ],
            order: [['created_at', 'DESC']]
        });

        return res.status(200).json({
            success: true,
            message: "All projects fetched successfully.",
            projects: projects
        })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching projects.",
            error: error
        })
    }
}

exports.findById = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Project fetched successfully.",
            project: req.project
        })
    }
    catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching project.",
            error: error
        })
    }
}

exports.update = async (req, res) => {
    try {
        const project = await Project.update(req.body, { where: { id: req.params.projectId }, returning: true, plain: true });

        return res.status(200).json({
            success: true,
            message: "Project updated successfully.",
            project: project
        })
    }
    catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error updating the project.",
            error: error
        })
    }
}

exports.delete = async (req, res) => {
    try {
        const project = await Project.destroy({ where: { id: req.params.projectId } });

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully.",
            project: project
        })
    } catch (error) {

        return res.status(400).json({
            success: false,
            message: "Error deleting the project.",
            error: error
        })
    }
}