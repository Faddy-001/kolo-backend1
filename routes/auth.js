const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const { signInValidation} = require('../validator/signUpValidation')
const { validate } = require('../validator/validate')


    router.post('/signIn',signInValidation(),validate ,auth.signIn);

    router.get('/signOut',auth.signout);
    router.post('/verifytoken',auth.verfiyToken);
    router.post('/forgetpassword',auth.forgotPassword);
    router.post('/newpassword',auth.newPassword);


module.exports = router

