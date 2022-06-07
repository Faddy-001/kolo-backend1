const express = require('express');
const router = express.Router();
const project = require("../controllers/projectController");
const {createProjectValidation,updateProjectValidation} = require('../validator/projectValidator')
const { validate } = require('../validator/validate')


const {isSignedIn,getLogedInUser,isAdmin,isAccessable,hasPermissionCreate,hasPermissionRead,hasPermissionUpdate,hasPermissionDelete} = require('../middleware/auth');

    router.param("projectId", project.getProject);

    router.post("/project",isSignedIn,getLogedInUser,isAccessable,hasPermissionCreate,createProjectValidation(),validate,project.create);

    router.get("/project",isSignedIn,getLogedInUser,isAccessable,hasPermissionRead,project.findAll);

    router.get("/project/:projectId",isSignedIn,getLogedInUser,isAccessable,hasPermissionRead,project.findById);

    router.put("/project/:projectId",isSignedIn,getLogedInUser,isAccessable,hasPermissionUpdate,updateProjectValidation(),validate,project.update);

    router.delete("/project/:projectId",isSignedIn,getLogedInUser,isAccessable,hasPermissionDelete,project.delete);
    
module.exports = router