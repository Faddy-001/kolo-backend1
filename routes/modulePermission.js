const express = require('express');
const router = express.Router();
const modulePermissionController = require('../controllers/modulePermissionController');
const {isSignedIn,getLogedInUser,isAdmin} = require('../middleware/auth');

   
router.param("modulepermissionId",modulePermissionController.getPermission);

router.get("/modulepermission",isSignedIn, getLogedInUser, isAdmin,modulePermissionController.findAll);

router.get("/modulepermission/:modulepermissionId", isSignedIn, getLogedInUser, isAdmin, modulePermissionController.findById);

router.post("/modulepermission",isSignedIn, getLogedInUser, isAdmin,modulePermissionController.create);

//router.delete("/modulefeature/:modulefeatureId", isSignedIn, getLogedInUser, isAdmin, modulePermissionController.delete);




    module.exports = router
