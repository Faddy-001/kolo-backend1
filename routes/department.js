const express = require('express');
const router = express.Router();
const department = require("../controllers/departmentController")
//const { validate } = require('../validator/validate')
const { createDeptValidation,updateDepartmentValidation} = require('../validator/deptValidator')
const { validate } = require('../validator/validate')
const {isSignedIn,getLogedInUser,isAdmin,isAccessable,hasPermissionCreate,hasPermissionRead,hasPermissionUpdate,hasPermissionDelete} = require('../middleware/auth');

    router.param("departmentId", department.getDepartment);

    router.post("/department",isSignedIn,getLogedInUser,isAccessable,hasPermissionCreate,createDeptValidation(),validate,department.create);

    router.get("/department",isSignedIn,getLogedInUser,isAccessable,hasPermissionRead,department.findAll);

    router.get("/department/:departmentId",isSignedIn,getLogedInUser,isAccessable,hasPermissionRead, department.findById);

    router.put("/department/:departmentId",isSignedIn,getLogedInUser,isAccessable,hasPermissionUpdate,updateDepartmentValidation(),validate, department.update);

    router.delete("/department/:departmentId",isSignedIn,getLogedInUser,isAccessable,hasPermissionDelete,department.delete);
module.exports = router