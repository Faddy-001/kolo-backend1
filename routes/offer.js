const express = require('express');
const router = express.Router();
const offer = require('../controllers/offerController');
const {createOfferValidation,updateOfferValidation} = require('../validator/offerValidator')
const { validate } = require('../validator/validate')
const {isSignedIn,getLogedInUser,isAdmin,isAccessable,hasPermissionCreate,hasPermissionRead,hasPermissionUpdate,hasPermissionDelete} = require('../middleware/auth');
const cron = require('node-cron');

    router.param("offerId", offer.getOffer);

    router.post("/offer",isSignedIn,getLogedInUser,isAccessable,hasPermissionCreate,createOfferValidation(),validate,offer.create);

    router.get("/offer/:offerId",isSignedIn,getLogedInUser,isAccessable,hasPermissionRead,offer.findOne);

    router.get("/offer",isSignedIn,getLogedInUser,isAccessable,hasPermissionRead,offer.findAll);

    router.put("/offer/:offerId",isSignedIn,getLogedInUser,isAccessable,hasPermissionUpdate,updateOfferValidation(),validate,offer.update);

    router.delete("/offer/:offerId",isSignedIn,getLogedInUser,isAccessable,hasPermissionDelete, offer.delete);

    router.get("/applicableOffers", offer.applicableOffers);
     
     //router.get("/expireoffers", offer.expireDate);
     cron.schedule('* 1 0 * * *', () => { 
        offer.expireDate();
       console.log("test");
    });
    module.exports = router