const { body, validationResult } = require('express-validator');
const { Customer } = require("../models");
exports.createCustomerValidation = (req, res) => {
   return [
      body('customer.first_name', 'First Name is Required').notEmpty().trim(),
      body('customer.last_name', 'Last Name is Required').notEmpty().trim(),
      body('customer.gender', 'Gender is Required').notEmpty(),
      body('customer.phone', 'Invalid Phone Number').notEmpty().isLength({ min: 10, max: 10 }),
      //body('customer.lead_reference', 'Lead is Required').notEmpty(),
      body('customer.phone').custom(value => {
         return Customer.findOne({ where: { phone: value } }).then(customer => {
            if (customer) {
               return Promise.reject('Phone number already exists.');
            }
         });
      }),
      body('customer.current_address','Current Address is Required').notEmpty().trim(),
      body('customer.permanent_address','Permanent Address is Required').notEmpty(),
      body('secondaryContact.first_name','First Name is Required').notEmpty().trim(),
      body('secondaryContact.last_name','Last Name is required').notEmpty().trim(),
      body('secondaryContact.gender','Gender is Required').notEmpty().trim(),
      body('secondaryContact.phone','Phone number is Required').notEmpty(),
      body('property.project_id','Project is Required').notEmpty(),
      body('property.property_type_id','Property Type is Required').notEmpty(),
      body('property.property_id','Property is Required').notEmpty(),
      body('property.payment_type','Payment Type is Required').notEmpty(),
      body('property.finalized_property_price','Finalized Property Price is Required').notEmpty(),
      body('payment.booking_amount','Booking amount is Required').notEmpty(),
      body('payment.payment_via','Payment Via is Required').notEmpty()
   ]
}