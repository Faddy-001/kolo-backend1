const express = require('express');
const router = express.Router();
const property = require("../controllers/propertyController");
const {createPropertyValidation,updatePropertyValidation} = require('../validator/propertyValidator')
const { validate } = require('../validator/validate')
const {isSignedIn,getLogedInUser,isAdmin,isAccessable,hasPermissionCreate,hasPermissionRead,hasPermissionUpdate,hasPermissionDelete} = require('../middleware/auth');
const upload = require('../middleware/upload');

    router.param("propertyId", property.getProperty)

    router.get('/property', isSignedIn, getLogedInUser, isAccessable,hasPermissionRead, property.findAll);

    router.get('/property/:propertyId', isSignedIn, getLogedInUser, isAccessable,hasPermissionRead, property.findById);

    router.post('/property', isSignedIn, getLogedInUser, isAccessable,hasPermissionCreate, upload.array('property_image'), createPropertyValidation(), validate, property.create);

    router.put('/property/:propertyId', isSignedIn, getLogedInUser, isAccessable,hasPermissionUpdate, upload.array('property_image'), updatePropertyValidation() ,validate, property.update);

    router.delete('/property/:propertyId', isSignedIn, getLogedInUser, isAccessable,hasPermissionDelete, property.delete);

    router.get('/searchProperties', isSignedIn, getLogedInUser, property.search);

    router.post('/property/deleteFile/:propertyId', isSignedIn, getLogedInUser,isAccessable,hasPermissionDelete, property.deleteFile);
module.exports = router;

//upload.fields([{name:'Property_Images',maxCount:10},{name:'Profile',maxCount:1}])