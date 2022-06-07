const express = require('express');
const router = express.Router();
const cheque = require("../controllers/chequeController")
const {isSignedIn,getLogedInUser} = require('../middleware/auth');

    router.param("chequeId", cheque.getcheque);

  //  router.post("/cheque",isSignedIn,getLogedInUser,cheque.create);

    router.get("/cheque",isSignedIn,getLogedInUser,cheque.findAll);

    router.get("/cheque/:chequeId",isSignedIn,getLogedInUser, cheque.findById);

    router.put("/cheque/:chequeId",isSignedIn,getLogedInUser,cheque.update);

    router.delete("/cheque/:chequeId",isSignedIn,getLogedInUser,cheque.delete);
module.exports = router