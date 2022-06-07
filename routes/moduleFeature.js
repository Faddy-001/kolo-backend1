const express = require('express');
const router = express.Router();
const moduleFeature = require('../controllers/moduleFeatureController');
const {isSignedIn,getLogedInUser,isAdmin} = require('../middleware/auth');

   
router.param("modulefeatureId",moduleFeature.getModuleFeature);
//console.log(router.param("modulefeatureId",moduleFeature.getModuleFeature));
router.get("/modulefeature",isSignedIn, getLogedInUser, isAdmin,moduleFeature.findAll);

router.get("/modulefeature/:modulefeatureId", isSignedIn, getLogedInUser, isAdmin, moduleFeature.findById);

router.post("/modulefeature",isSignedIn, getLogedInUser, isAdmin,moduleFeature.create);

router.delete("/modulefeature/:modulefeatureId", isSignedIn, getLogedInUser, isAdmin, moduleFeature.delete);

module.exports = router
