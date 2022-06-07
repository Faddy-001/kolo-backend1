const express = require('express');
const router = express.Router();
const lead = require('../controllers/leadController');
const {isSignedIn,getLogedInUser,isAccessable,hasPermissionCreate,hasPermissionRead,hasPermissionUpdate,hasPermissionDelete} = require('../middleware/auth');
const {createleadValidation,updateleadValidation} = require('../validator/leadValidator')
const { validate } = require('../validator/validate')
const upload = require('../middleware/upload');

    router.param('leadId', lead.getLead);

    router.post('/lead',isSignedIn,getLogedInUser,isAccessable,hasPermissionCreate, createleadValidation(),validate,lead.create);

    router.get('/lead', isSignedIn, getLogedInUser, lead.fetchActive);

    router.get('/deactiveLead', isSignedIn, getLogedInUser, isAccessable, hasPermissionRead, lead.fetchDeactive);

    router.get('/uncalledLead', isSignedIn, getLogedInUser, isAccessable, hasPermissionRead, lead.fetchUncalled);

    router.get('/lead/:leadId', isSignedIn, getLogedInUser,isAccessable,hasPermissionRead, lead.findById);

    router.put('/lead/:leadId', isSignedIn, getLogedInUser,isAccessable,hasPermissionUpdate,updateleadValidation(),validate, lead.update);

    router.put('/deactivateLead/:leadId', isSignedIn, getLogedInUser, isAccessable,hasPermissionUpdate, lead.deactivate);

    router.put('/activateLead/:leadId', isSignedIn, getLogedInUser, isAccessable,hasPermissionUpdate, lead.activate);

    router.get('/exportLead/:leadType', isSignedIn, getLogedInUser, lead.exportCSV);

    router.post('/importActiveLead', isSignedIn, getLogedInUser, upload.single('file'), lead.importCSV);

    router.get('/todaysFollowUp', isSignedIn, getLogedInUser, isAccessable,hasPermissionRead, lead.todaysFollowUp);

    router.get('/filterLeads/:leadType', lead.filter);

    router.get('/searchLeads/:leadType', lead.search);
module.exports = router