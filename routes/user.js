const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');

const {isSignedIn,getLogedInUser,isAdmin,isAccessable,hasPermissionCreate,hasPermissionRead,hasPermissionUpdate,hasPermissionDelete} = require('../middleware/auth');
const {createUserValidation, updateUserValidator} = require('../validator/userValidator');
const { validate } = require('../validator/validate')

const upload = require('../middleware/upload');

    router.param("userId", user.getUser);

    // Create a new user
    router.post('/user',isSignedIn,getLogedInUser,isAccessable,hasPermissionCreate,upload.single('profile_image'),createUserValidation(),validate,user.create);

    router.get('/user',isSignedIn,getLogedInUser,isAccessable,hasPermissionRead,user.findAll);
  
    router.get('/user/:userId',isSignedIn,getLogedInUser,isAccessable,hasPermissionRead,user.findById);

    router.put('/user/:userId',isSignedIn,getLogedInUser,isAccessable,hasPermissionUpdate,upload.single('profile_image'),updateUserValidator(),validate,user.update);

    router.delete('/user/:userId',isSignedIn,getLogedInUser,isAccessable,hasPermissionDelete,user.delete);

    router.put('/deactivateUser/:userId',isSignedIn,getLogedInUser,isAccessable,hasPermissionUpdate,user.deactivateUser);

    router.put('/activateUser/:userId',isSignedIn,getLogedInUser,isAccessable,hasPermissionUpdate,user.activateUser);

module.exports = router