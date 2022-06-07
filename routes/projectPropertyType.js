const express = require('express');
const router = express.Router();
const projectPropertyType = require('../controllers/projectPropertyTypeController');
const {isSignedIn,getLogedInUser,isAdmin,isAccessable,hasPermissionCreate,hasPermissionRead,hasPermissionUpdate,hasPermissionDelete} = require('../middleware/auth');

    router.param('projectPropertyTypeId', projectPropertyType.getProjectPropertyType);

    router.get('/projectPropertyType', isSignedIn, getLogedInUser,isAccessable,hasPermissionRead, projectPropertyType.findAll);

    router.get('/projectPropertyType/:projectPropertyTypeId', isSignedIn, getLogedInUser, isAccessable,hasPermissionRead, projectPropertyType.findById);

    router.post('/projectPropertyType', isSignedIn, getLogedInUser, isAccessable,hasPermissionCreate, projectPropertyType.create);

    router.delete('/projectPropertyType/:projectPropertyTypeId', isSignedIn, getLogedInUser, isAccessable,hasPermissionDelete, projectPropertyType.delete);
    
module.exports = router