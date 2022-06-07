const express = require('express');
const router = express.Router();
const preBooking = require('../controllers/preBookingController');
const {isSignedIn,getLogedInUser,isAccessable,hasPermissionCreate,hasPermissionRead,hasPermissionUpdate,hasPermissionDelete} = require('../middleware/auth');
const upload = require('../middleware/upload');

    router.param('preBookingId', preBooking.getPreBooking);

    router.post('/preBooking', isSignedIn, getLogedInUser,isAccessable,hasPermissionCreate, upload.array('commitment_image'), preBooking.create);

    router.get('/preBooking/:preBookingId', isSignedIn, getLogedInUser,isAccessable,hasPermissionRead, preBooking.findById);

    router.get('/preBooking', isSignedIn, getLogedInUser, isAccessable,hasPermissionRead, preBooking.findAll);

    router.put('/preBooking/:preBookingId', isSignedIn, getLogedInUser,isAccessable,hasPermissionUpdate, upload.array('commitment_image'), preBooking.update);

    router.delete('/preBooking/:preBookingId', isSignedIn, getLogedInUser,isAccessable,hasPermissionDelete, preBooking.delete);

    router.put('/discardPreBooking/:preBookingId', isSignedIn, getLogedInUser, preBooking.discard);

    router.post('/preBooking/deleteFile/:preBookingId', isSignedIn, getLogedInUser, preBooking.deleteFile);

module.exports = router;
