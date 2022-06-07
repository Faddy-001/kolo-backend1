const express = require('express');
const router = express.Router();
const profession = require('../controllers/professionController');
const {isSignedIn,getLogedInUser,isAdmin,isAccessable,hasPermissionCreate,hasPermissionRead,hasPermissionUpdate,hasPermissionDelete} = require('../middleware/auth');
const {createProfessionValidation,updateProfessionValidation} = require('../validator/professionValidator')
const { validate } = require('../validator/validate')

    router.param('professionId', profession.getProfession);

    router.post('/profession',isSignedIn,getLogedInUser,isAccessable,hasPermissionCreate,createProfessionValidation(),validate,profession.create);

    router.get('/profession', isSignedIn,getLogedInUser,isAccessable,hasPermissionRead,profession.findAll);

    router.get('/profession/:professionId', isSignedIn,getLogedInUser,isAccessable,hasPermissionRead,profession.findById);

    router.put('/profession/:professionId',isSignedIn,getLogedInUser,isAccessable,hasPermissionUpdate,updateProfessionValidation(),validate, profession.update);

    router.delete('/profession/:professionId',isSignedIn,getLogedInUser,isAccessable,hasPermissionDelete, profession.delete);

module.exports = router