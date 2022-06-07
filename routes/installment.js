const express = require('express');
const router = express.Router();
const installment = require("../controllers/installmentController");
const {isSignedIn,getLogedInUser} = require('../middleware/auth');

   // router.param("installmentId", installment.getinstallment);

  //  router.post("/installment",isSignedIn,getLogedInUser,installment.create);

//    router.get("/installment",isSignedIn,getLogedInUser,installment.findAll);

    //router.get("/installment/:installmentId",isSignedIn,getLogedInUser, installment.findById);

    router.put("/installment/:installmentId",installment.update);

   // router.delete("/installment/:installmentId",isSignedIn,getLogedInUser,installment.delete);

    module.exports = router