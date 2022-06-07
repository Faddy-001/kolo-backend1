const express = require('express');
const router = express.Router();
const paymentVia = require('../controllers/paymentViaController');
const {isSignedIn,getLogedInUser,isAdmin} = require('../middleware/auth');

    router.param("paymentViaId", paymentVia.getPaymentVia);

    router.post("/paymentVia", isSignedIn,getLogedInUser, paymentVia.create);

    router.get("/paymentVia/:paymentViaId", isSignedIn,getLogedInUser,paymentVia.findById);

    router.get("/paymentVia", isSignedIn,getLogedInUser,paymentVia.findAll);

    router.put("/paymentVia/:paymentViaId", isSignedIn,getLogedInUser,paymentVia.update);

    router.delete("/paymentVia/:paymentViaId", isSignedIn,getLogedInUser,paymentVia.delete);

module.exports = router