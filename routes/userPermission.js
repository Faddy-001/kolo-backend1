const express = require('express');
const router = express.Router();
const accessUserPermission = require('../controllers/userPermissionController');
const { isSignedIn, getLogedInUser, isAdmin,isAccessable } = require('../middleware/auth');

router.param("accessUserPermissionId", accessUserPermission.getAccessPermission);

router.get("/accessUserPermission", isSignedIn, getLogedInUser, isAdmin,isAccessable,accessUserPermission.findAll);

router.get("/accessUserPermission/:accessUserPermissionId", isSignedIn, getLogedInUser, isAdmin, accessUserPermission.findById);

router.post("/accessUserPermission", isSignedIn, getLogedInUser, isAdmin, accessUserPermission.create);

//router.delete("/accessUserPermission/:accessUserPermissionId", isSignedIn, getLogedInUser, isAdmin, accessUserPermission.delete);




module.exports = router
