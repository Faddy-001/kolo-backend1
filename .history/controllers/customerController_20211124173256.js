
const { Offer, Project, PropertyType, Address, Customer, Document, Image, Secondary_Contact, Customer_Property, Cheque, Payment_History, Payment, Payment_Via, Property, Lead, sequelize } = require('../models');

exports.getCustomer = async (req, res, next, id) => {
    try {
        const customer = await Customer.findByPk(id, {
            include: [
                { model: Address },
                {
                    model: Document,
                    include: [{
                        model: Image
                    }], attributes: ['id', 'type', 'number']
                },
                {
                    model: Secondary_Contact, include: [
                        {
                            model: Document,
                            include: [{
                                model: Image
                            }], attributes: ['id', 'type', 'number']
                        },
                        { model: Address }
                    ]
                },
                {
                    model: Customer_Property, include: [
                        {
                            model: Payment, include: [
                                { model: Payment_Via }
                            ]
                        },
                        {
                            model: Property, include: [
                                { model: Project, attributes: ['id', 'name'] },
                                { model: PropertyType, attributes: ['id', 'name'] }
                            ]
                        }
                    ]
                }
            ]
        });
        let updatedPropertyPrice = 0;
        let totalReceivedAmount = 0;
        let totalRemainingAmount = 0;
        let overdue = 0;

        if (customer.Customer_Properties != false) {
            for (let i = 0; i < customer.Customer_Properties.length; i++) {
                if (customer.Customer_Properties[i].offer != null) {
                    var offers = [];
                    customer.Customer_Properties[i].offer = customer.Customer_Properties[i].offer.split(",").map(x => +x);
                    for (let j = 0; j < customer.Customer_Properties[i].offer.length; j++) {
                        let offer = await Offer.findByPk(customer.Customer_Properties[i].offer[j]);
                        offers.push({ 'id': offer.id, 'name': offer.name, 'benefit': offer.benefit });
                    }
                    customer.Customer_Properties[i].offer = offers;
                }
            }
        }

        if (customer) {
            for (let i = 0; i < customer.Customer_Properties.length; i++) {
                for (let j = 0; j < customer.Customer_Properties[i].Payments.length; j++) {
                    totalReceivedAmount += customer.Customer_Properties[i].Payments[j].received_amount;
                    updatedPropertyPrice += customer.Customer_Properties[i].Payments[j].penalty_amount;
                    totalRemainingAmount = updatedPropertyPrice - totalReceivedAmount;
                }
            }
            // console.log(totalReceivedAmount);
            // console.log(totalRemainingAmount);
            // console.log(updatedPropertyPrice);

            req.customer = customer;
            next();
        } else {
            throw "Customer doesn't exists.";
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Customer doesn't exists.",
            error: error
        })
    }
}

exports.create = async (req, res) => {
    try {
        // req.body.property = JSON.parse(req.body.property);
        // req.body.customer = JSON.parse(req.body.customer);
        // req.body.secondaryContact = JSON.parse(req.body.secondaryContact);
        // req.body.payment = JSON.parse(req.body.payment);

        await sequelize.transaction(async (t) => {
            let secondaryContactDocs = [];
            let customerDocs = [];
            let installments = [];
            let status = "Booked";
            let cheque = "";
            let lead = '';
            let propertySold = '';
            let totalRecievingAmount = 0;
            

            let property = await Property.findByPk(req.body.property.property_id);
            if (property.status == 'Booked' || property.status == 'Registered') {
                return res.status(400).json({
                    success: false,
                    message: "Property already sold."
                })
            }

            if (req.body.installments) {

                for (let i = 0; i < req.body.installments.length; i++) {
                    totalRecievingAmount += req.body.installments[i].receiving_amount

                }


            }

            if (totalRecievingAmount > req.body.property.finalized_property_price) {
                return res.status(400).json({
                    success: false,
                    message: "Receiving amount is greater than Property Price."
                })
            }

            let secondaryContactDetails = {
                first_name: req.body.secondaryContact.first_name,
                middle_name: req.body.secondaryContact.middle_name,
                last_name: req.body.secondaryContact.last_name,
                gender: req.body.secondaryContact.gender,
                phone: req.body.secondaryContact.phone,
                alternate_phone: req.body.secondaryContact.alternate_phone,
                email: req.body.secondaryContact.email,
                relation_with_customer: req.body.secondaryContact.relation_with_customer
            };
            const secondaryContact = await Secondary_Contact.create(secondaryContactDetails, { transaction: t });

            if (req.body.secondaryContact.current_address) {
                req.body.secondaryContact.current_address.address_type = "Current",
                    address = await secondaryContact.createAddress(req.body.secondaryContact.current_address, { transaction: t });
            }
            if (req.body.secondaryContact.permanent_address) {
                req.body.secondaryContact.permanent_address.address_type = "Permanent",
                    address = await secondaryContact.createAddress(req.body.secondaryContact.permanent_address, { transaction: t });
            }

            if (req.body.secondaryContact.document) {
                for (let i = 0; i < req.body.secondaryContact.document.length; i++) {
                    let secondaryContactDocument = {
                        type: req.body.secondaryContact.document[i].type,
                        number: req.body.secondaryContact.document[i].number,
                    };

                    let scd = await secondaryContact.createDocument(secondaryContactDocument, { transaction: t });

                    secondaryContactDocs.push(scd);
                    // console.log(scd);
                }
            }

            if (req.body.payment.booking_amount > req.body.property.finalized_property_price) {
                return res.status(400).json({
                    success: false,
                    message: "Receiving amount is greater than Property Price."
                })
            }
            let customerDetails = {
                first_name: req.body.customer.first_name,
                middle_name: req.body.customer.middle_name,
                last_name: req.body.customer.last_name,
                gender: req.body.customer.gender,
                phone: req.body.customer.phone,
                alternate_phone: req.body.customer.alternate_phone,
                email: req.body.customer.email,
                user_id: req.profile.id,
                secondary_contact_id: secondaryContact.id,
                lead_id: req.body.customer.lead_id ? req.body.customer.lead_id : null
            };
            const customer = await Customer.create(customerDetails, { transaction: t });



            if (req.body.customer.current_address) {
                req.body.customer.current_address.address_type = "Current",
                    address = await customer.createAddress(req.body.customer.current_address, { transaction: t });
            }
            if (req.body.customer.permanent_address) {
                req.body.customer.permanent_address.address_type = "Permanent",
                    address = await customer.createAddress(req.body.customer.permanent_address, { transaction: t });
            }

            if (req.body.customer.document) {
                for (let i = 0; i < req.body.customer.document.length; i++) {
                    let customerDocument = {
                        type: req.body.customer.document[i].type,
                        number: req.body.customer.document[i].number
                    }
                    //console.log(customerDocument);
                    let cd = await customer.createDocument(customerDocument, { transaction: t });
                    customerDocs.push(cd);

                }
            }

            let customerPropertyDetail = {
                project_id: req.body.property.project_id,
                property_type_id: req.body.property.property_type_id,
                property_id: req.body.property.property_id,
                payment_type: req.body.property.payment_type,
                commitment: req.body.property.commitment,
                offer: req.body.property.offer ? req.body.property.offer.toString() : null,
                user_id: req.profile.id,
                customer_id: customer.id,
                finalized_property_price: req.body.property.finalized_property_price,
                status: status
            }
            const customerProperty = await Customer_Property.create(customerPropertyDetail, { transaction: t });

           // console.log(req.body.payment.payment_via.name == "Cheque");
           
            let paymentDetail = {
                receiving_amount: req.body.payment.booking_amount,
                receiving_amount_date: req.body.payment.booking_amount_date ? req.body.payment.booking_amount_date : Date.now(),
                received_amount: req.body.payment.booking_amount,
                received_amount_date: req.body.payment.booking_amount_date ? req.body.payment.booking_amount_date : Date.now(),
                payment_via_id: req.body.payment.payment_via.id,
                status: req.body.payment.payment_via.name != 'Cheque' ? "Success" : "Pending",
               // remaining_amount: req.body.property.finalized_property_price - req.body.payment.booking_amount,
               // remaining_amount: req.body.payment.booking_amount,
                // remaining_amount: req.body.payment.payment_via.name != 'Cheque' ? 0 : req.body.payment.booking_amount ,
                remaining_amount: 0,
                customer_property_id: customerProperty.id,
                user_id: req.profile.id

            }
            const payment = await Payment.create(paymentDetail, { transaction: t });


 
            if (req.body.installments) {
                console.log("Testing");
                 for (let i = 0; i < req.body.installments.length; i++) {
                    let installmentDetails = {
                        receiving_amount: req.body.installments[i].receiving_amount,
                        receiving_amount_date: req.body.installments[i].receiving_amount_date,
                        customer_property_id: customerProperty.id,
                        user_id: req.profile.id,
                        task_name: req.body.installments[i].task_name ? req.body.installments[i].task_name : null,
                        is_complete: req.body.installments[i].task_name ? 0 : null

                    }
                    let installment = await Payment.create(installmentDetails, { transaction: t });
                    installments.push(installment);

                }
            }

            if (req.body.payment.payment_via.name == 'Cheque') {
                console.log("Testing");
                let chequeDetails = {
                    type: req.body.payment.type,
                    number: req.body.payment.number,
                    date: Date.now(),
                    amount: req.body.payment.booking_amount,
                    payment_id: payment.id
                }
                cheque = await Cheque.create(chequeDetails, { transaction: t });
            }


            let paymentHistoryDetails = {
                received_amount: req.body.payment.booking_amount,
                received_amount_date: req.body.payment.booking_amount_date ? req.body.payment.booking_amount_date : Date.now(),
                payment_id: payment.id,
                payment_via_id: 1,
                status: req.body.payment.payment_via.name != 'Cheque' ? "Success" : "Pending",
                cheque_id: req.body.payment.payment_via.name != 'Cheque' ? null : cheque.id,
                remark: "",
                user_id: req.profile.id
            }
            const paymentHistory = await Payment_History.create(paymentHistoryDetails, { transaction: t });

            if (req.body.customer.lead_reference) {
                lead = Lead.update({ status: 'Booked' }, { where: { id: req.body.customer.lead_reference } }, { transaction: t });
            }
            propertySold = Property.update({ status: 'Booked' }, { where: { id: req.body.property.property_id } }, { transaction: t });

            return res.status(200).json({
                success: true,
                message: "Customer added successfully",
                customer: customer,
                customerDocument: customerDocs,
                secondaryContact: secondaryContact,
                secondaryContactDocument: secondaryContactDocs,
                customerProperty: customerProperty,
                payment: payment,
                cheque: cheque,
                installments: installments,
                paymentHistory: paymentHistory
            })
        });
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Customer creation failed",
            error: error
        })
    }
}

exports.findById = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "Customer fetched successfully.",
            customer: req.customer
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching customer.",
            error: error
        })
    }
}

exports.findAll = async (req, res) => {
    try {
        const customers = await Customer.findAll({
            include: [
                {
                    model: Document,
                    include: [{
                        model: Image
                    }], attributes: ['id', 'type', 'number']
                },
                {
                    model: Secondary_Contact, include: [
                        {
                            model: Document,
                            include: [{
                                model: Image
                            }], attributes: ['id', 'type', 'number']
                        },
                        { model: Address }
                    ]
                },
                {
                    model: Customer_Property, include: [
                        { model: Payment }
                    ]
                },
                { model: Address }
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Customers fetched successfully.",
            customers: customers
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching Customers.",
            error: error
        })
    }
}

exports.delete = async (req, res) => {
    try {
        const customer = await Customer.destroy({ where: { id: req.params.customerId } });

        if (customer) {
            res.json({
                message: "Deleted"
            })
        }
    } catch (error) {
        console.log(error);
    }
}





exports.add_other_way = async (req,res) => {





}