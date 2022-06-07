const express = require('express');
const router = express.Router();
const role = require('../controllers/roleController');
const { route } = require('./user');
const {isSignedIn,getLogedInUser,isAdmin,isAccessable,hasPermissionCreate,hasPermissionRead,hasPermissionUpdate,hasPermissionDelete} = require('../middleware/auth');
const {createRoleValidation,updateRoleValidation} = require('../validator/roleValidator')
const { validate } = require('../validator/validate')



    router.param("roleId", role.getRole);

    router.post("/role",isSignedIn,getLogedInUser,isAccessable,hasPermissionCreate,createRoleValidation(),validate,role.create);

    router.get("/role",isSignedIn,getLogedInUser,isAccessable,hasPermissionRead,role.findAll);

    router.get("/role/:roleId",isSignedIn,getLogedInUser,isAccessable,hasPermissionRead,role.findById);

    router.put("/role/:roleId",isSignedIn,getLogedInUser,isAccessable,hasPermissionUpdate,updateRoleValidation(),validate, role.update);

    router.delete("/role/:roleId",isSignedIn,getLogedInUser,isAccessable,hasPermissionDelete,role.delete);
module.exports= router;