const express = require('express');
const router = express.Router();
const propertyType = require("../controllers/propertyTypeController");
const {createPropertyTypeValidation,updatePropertyTypeValidation} = require('../validator/propertyTypeValidator')
const { validate } = require('../validator/validate')
const {isSignedIn,getLogedInUser,isAdmin,isAccessable,hasPermissionCreate,hasPermissionRead,hasPermissionUpdate,hasPermissionDelete} = require('../middleware/auth');
    router.param("propertyTypeId", propertyType.getPropertyType);

    router.post("/propertyType",isSignedIn,getLogedInUser,isAccessable,hasPermissionCreate,createPropertyTypeValidation(),validate,propertyType.create);

    router.get("/propertyType/:propertyTypeId",isSignedIn,getLogedInUser,isAccessable,hasPermissionRead, propertyType.findById);

    router.get("/propertyType",isSignedIn,getLogedInUser,isAccessable,hasPermissionRead, propertyType.findAll);

    router.put("/propertyType/:propertyTypeId",isSignedIn,getLogedInUser,isAccessable,hasPermissionUpdate,updatePropertyTypeValidation(),validate,propertyType.update);

    router.delete("/propertyType/:propertyTypeId",isSignedIn,getLogedInUser,isAccessable,hasPermissionDelete,propertyType.delete);

    router.post("/removeProject/:propertyTypeId",isSignedIn,getLogedInUser,isAccessable,hasPermissionDelete, propertyType.removeProject);
    
module.exports = router