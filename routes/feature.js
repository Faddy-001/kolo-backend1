const express = require('express');
const router = express.Router();
const feature = require("../controllers/featureController")

//const { validate } = require('../validator/validate')
const {isSignedIn,getLogedInUser,isAdmin} = require('../middleware/auth');

    router.param("featureId", feature.getFeature);

    router.post("/feature",isSignedIn,getLogedInUser,isAdmin,feature.create);


    router.get("/features",isSignedIn,getLogedInUser,isAdmin,feature.findAll);
    router.get("/feature", feature.findAll);


    router.get("/feature/:featureId",isSignedIn,getLogedInUser,isAdmin, feature.findById);

    router.put("/feature/:featureId",isSignedIn,getLogedInUser,isAdmin, feature.update);

    router.delete("/feature/:featureId",isSignedIn,getLogedInUser,isAdmin,feature.delete);
module.exports = router