const { User, Role, Project_Department_User, Project, Feature, Feature_Access_Permission, Module_Permission, User_Permission, Module_Feature, Department, Address, sequelize, Image, Module } = require("../models");
const { Op, where } = require("sequelize");
var path = require('path');
const { parse } = require("dotenv");
const { raw } = require("body-parser");

exports.getUser = async (req, res, next, id) => {
  try {
    let user = await User.findByPk(id, {
      include: [
        { model: Image },
        { model: Address },
        { model: Role, include: [
            {model: Module_Permission},
            {model:Feature_Access_Permission,include:[
              {model:Feature,attributes: ['id', 'name'],include:[
                {model:Module}
              ]}
            ]}
        ]}
      ],
      attributes: {exclude: ['password']}
    });

    if (user) {
      const projectDepartmentUser = await Project_Department_User.findAll({ where: { user_id: id}, attributes: ['id'] , include: [
        { model: Project, attributes: ['id', 'name'] },
        { model: Department, attributes: ['id', 'name', 'project_id'] }
      ]});
  
      let projects = [];
      user.Projects = [];
      
      for (let i = 0; i < projectDepartmentUser.length; i++) {
        if(projects.indexOf(projectDepartmentUser[i].Project.id) === -1) {
          projects.push(projectDepartmentUser[i].Project.id);
          await user.Projects.push({
            id : projectDepartmentUser[i].Project.id,
            name : projectDepartmentUser[i].Project.name,
            departments: []
          })               
        }        
      }
      for (let i = 0; i < projectDepartmentUser.length; i++) {
        let projectIdIndex = projects.indexOf(projectDepartmentUser[i].Department.project_id);
        await user.Projects[projectIdIndex].departments.push(projectDepartmentUser[i].Department.id)
      }
      
      req.user = user;
      next();
    }
    else {
      throw "User does not exists.";
    }

  } catch (error) {
    console.log(error)
    return res.status(400).json({
      success: false,
      message: "User does not exists.",
      error: error
    })
  }
}

// Create and Save a new user
exports.create = async (req, res) => {
  try {
    await sequelize.transaction(async (t) => {
      let rolepermission=[];
      let projectDepartmentUsers = [];
      req.body.projects = JSON.parse(req.body.projects);
      let address, image = "";
      const user = await User.create(req.body, { transaction: t });
      for (let i = 0; i < req.body.projects.length; i++) {
        for (let j = 0; j < req.body.projects[i].departments.length; j++) {
          let projectDepartmentUser = {
            project_id: req.body.projects[i].id,
            department_id: req.body.projects[i].departments[j],
            user_id: user.id
          }
          let pdu = await Project_Department_User.create(projectDepartmentUser, { transaction: t });
          projectDepartmentUsers.push(pdu);
        }
      }
      
      if (req.body.address) {
        req.body.address = JSON.parse(req.body.address);
        req.body.address.address_type = "Current";
        address = await user.createAddress(req.body.address, { transaction: t });
      };

      if (req.file) {
        let image_values = {
          image_type: req.file.fieldname,
          title: req.file.originalname,
          src: req.file.path,
          mime_type: req.file.mimetype
        }
        image = await user.createImage(image_values, { transaction: t });
      }

      return res.status(200).json({
        success: true,
        message: "User created successfully",
        user: user,
        address: address,
        image: image,
        Project_Department_User: projectDepartmentUsers
      });
    })
  }
  catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "User creation failed",
      error: error
    });
  }
}

// Get all users
exports.findAll = async (req, res) => {
  let where = { name: {[Op.notIn]: ['Super Admin']} }
  if (req.profile.Role.name == 'Super Admin') {
    where = {}
  }
  const users = await User.findAll({
    include: [
      { model: Department, include:[
        { model: Project, attributes: ['id', 'name'] }
      ], attributes: ['id', 'name'] },
      { model: Address },
      { model: Role,
        where : where,
        include: [
        {model: Module_Permission},
        {model:Feature_Access_Permission,include:[
          {model:Feature,attributes: ['id', 'name'],include:[
            {model:Module}
          ]}
        ]}
      ]},
    ],
    attributes: {exclude: ['password']},
    order: [['created_at', 'DESC']]
  });
  
  return res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    user: users
  });

}

// Get user by ID
exports.findById = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      user: req.user,
      projects: req.user.Projects
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: "Error fetching User.",
      error: error
    });
  }
}

// Update User
exports.update = async (req, res) => {
  try {
    let address, image = '';
    let projectDepartmentUsers = [];
    await sequelize.transaction(async (t) => {
      let user = await User.update(req.body, { where: { id: req.params.userId }, individualHooks: true }, { transaction: t });
      if (req.body.address) {
        req.body.address = JSON.parse(req.body.address);
        address = await Address.update(req.body.address, {
          where: {
            [Op.and]: [
              { addressable_type: "User" },
              { addressable_id: req.params.userId }
            ]
          }, individualHooks: true
        }, { transaction: t })
      }

      if (req.body.projects) {
        req.body.projects = JSON.parse(req.body.projects);
        await Project_Department_User.destroy({where: {user_id: req.params.userId}});

        for (let i = 0; i < req.body.projects.length; i++) {
          for (let j = 0; j < req.body.projects[i].departments.length; j++) {
            let projectDepartmentUser = {
              project_id: req.body.projects[i].id,
              department_id: req.body.projects[i].departments[j],
              user_id: req.params.userId
            }
            let pdu = await Project_Department_User.create(projectDepartmentUser, { transaction: t });
            projectDepartmentUsers.push(pdu);
          }
        }
      }

      if (req.file) {
        let image_values = {
          imageable_type: "User",
          imageable_id: req.params.userId,
          image_type: req.file.fieldname,
          title: req.file.originalname,
          src: req.file.path,
          mime_type: req.file.mimetype
        }
        let userimage = await Image.findOne({
          where: {
            imageable_type: 'User',
            imageable_id: req.params.userId
          }, raw: true
        })
        if (userimage) {
          image = await Image.update(image_values, {
            where: { id: userimage.id }
          }, { transaction: t })
        } else {
          image = await Image.create(image_values, { transaction: t })
        }
      }

      if (user[1] || address[1] || image[1]) {
        return res.status(200).json({
          success: true,
          message: "User updated successfully",
          user: user,
          address: address,
          image: image
        });
      } else {
        return res.status(500).json({
          success: false,
          message: "User does not exist",
        });
      }
    })        
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error updating User.",
      error: error
    });
  }
}

// Delete User
exports.delete = async (req, res) => {
  let user = await User.destroy({ where: { id: req.params.userId } });
  if (user) {
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } else {
    return res.status(500).json({
      success: false,
      message: "User does not exist",
    });
  }
}

//Deactivate User
exports.deactivateUser = async (req, res)=> {
  try {
    let user = await User.update({ is_active: false }, { where: { id: req.params.userId }});

      return res.status(200).json({
        success: true,
        message: "User deactivated successfully",
        user: user
      });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error deactivating user.",
    });
  }
}

//Activate User
exports.activateUser = async (req, res)=> {
  try {
    let user = await User.update({ is_active: true }, { where: { id: req.params.userId }});

      return res.status(200).json({
        success: true,
        message: "User activated successfully",
        user: user
      });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error activating user.",
    });
  }
}

// This is a test branch

// This one is for closing issue #106