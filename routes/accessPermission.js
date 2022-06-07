const express = require('express');
const router = express.Router();
const accessPermissionController = require('../controllers/featureAccessRoleController');
const { isSignedIn, getLogedInUser, isAdmin } = require('../middleware/auth');


router.param("accesspermissionId",accessPermissionController.getAccessPermission);

router.get("/accesspermission", isSignedIn, getLogedInUser, isAdmin, accessPermissionController.findAll);

router.get("/accesspermission/:accesspermissionId", accessPermissionController.findById);

router.post("/accesspermission", isSignedIn, getLogedInUser, isAdmin, accessPermissionController.create);

//router.delete("/modulefeature/:modulefeatureId", isSignedIn, getLogedInUser, isAdmin, modulePermissionController.delete);




module.exports = router
