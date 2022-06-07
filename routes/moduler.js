const express = require('express');
const router = express.Router();
const moduler = require("../controllers/moduleController")

//const { validate } = require('../validator/validate')
const {isSignedIn,getLogedInUser,isAdmin} = require('../middleware/auth');

    router.param("modulerId", moduler.getModuler);

    router.post("/moduler",isSignedIn,getLogedInUser,isAdmin,moduler.create);


    router.get("/modulers",isSignedIn,getLogedInUser,moduler.findAll);
    router.get("/moduler", moduler.findAll);


    router.get("/moduler/:modulerId",isSignedIn,getLogedInUser, moduler.findById);

    router.put("/moduler/:modulerId",isSignedIn,getLogedInUser, moduler.update);

    router.delete("/moduler/:modulerId",isSignedIn,getLogedInUser,moduler.delete);
module.exports = router