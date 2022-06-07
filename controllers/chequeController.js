const { Customer, Customer_Property, Cheque, Payment_History, Payment, Payment_Via, Property, sequelize } = require('../models');

// Fetch cheque by parameter
exports.getcheque = async (req, res, next, id) => {
    try {
        const cheque = await Cheque.findByPk(id,
            {
                include: [
                    { model: Payment },
                    //  {Payment_History}

                ]
            }
        );
        if (cheque) {
            req.cheque = cheque;
            next();
        } else {
            throw "cheque does not exists.";
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "cheque does not exists.",
            error: error
        })
    }
}

// Creating a new cheque
exports.create = async (req, res) => {

}



// To fetch all the cheques
exports.findAll = async (req, res) => {
    try {


        const cheques = await Cheque.findAll({

        });

        return res.status(200).json({
            success: true,
            message: "All cheques fetched successfully.",
            cheque: cheques,

        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching cheques.",
            error: error
        })
    }
}

// To fetch cheque by Id
exports.findById = async (req, res) => {
    try {
        return res.status(200).json({
            success: true,
            message: "cheque fetched successfully.",
            cheque: req.cheque
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching the cheque.",
            error: error
        })
    }
}

// Update cheque by Id
exports.update = async (req, res) => {
    try {

        await sequelize.transaction(async (t) => {
            let cheque
            let payment
            let paymentHistory
           // let total_received_amount = 0.00;
            //let total_remaining_amount = cheques.Payment.receiving_amount - cheques.amount;

            let cheques = await Cheque.findByPk(req.params.chequeId,
                {
                    include: [
                        { model: Payment }
                    ]
                });
          //  console.log(cheques.Payment.received_amount);   
            if(cheques.status == "Cleared" || cheques.status == "Bounced" ) {
                return res.status(400).json({
                    success: false,
                    message: " cheque already used ",
                    
                })
            }else {

            if (req.body.status == 'Bounced') {

                let bouncedDetails = {
                    status: req.body.status,
                    status_date: req.body.status_date ? req.body.status_date : Date.now(),
                    bounce_charge: req.body.bounce_charge,
                    reason_for_bounce: req.body.reason_for_bounce
                }
                cheque = await Cheque.update(bouncedDetails, { where: { id: req.params.chequeId }, returning: true, plain: true }, { transaction: t });
                //console.log(cheques.Payment.remaining_amount + bouncedDetails.bounce_charge);
                let penalty_amt = (parseInt(cheques.Payment.penalty_amount) + parseInt(bouncedDetails.bounce_charge)) ;
                
                
                let remaining_amt1 = (parseInt(cheques.Payment.remaining_amount)  +  parseInt(cheques.amount)) ;
                let remaining_amt2 = (remaining_amt1 + parseInt(bouncedDetails.bounce_charge)) ;
                
                
                //let remaining_amt2 = (parseInt(cheques.Payment.receiving_amount) + parseInt(cheques.Payment.penalty_amount) + parseInt(req.body.bounce_charge)) ;
                //console.log(remaining_amt2); //its working
                console.log(remaining_amt2);
                
                
                
                let paymentupdated = {
                    penalty_amount: penalty_amt,
                    remark: req.body.remark,
                    received_amount:(cheques.Payment.received_amount - cheques.amount),
                    //receiving_amount :received_amount+penalty_amount,
                   // remaining_amount : remaining_amt,
                   // remaining_amount : cheques.Payment.remaining_amount == null ? remaining_amt2 : remaining_amt ,
                    remaining_amount :  remaining_amt2 ,
                    status: "Pending"
                }
                console.log(paymentupdated.remaining_amount);
                payment = await Payment.update(paymentupdated, { where: { id: cheques.payment_id } }, { transaction: t });
                
                //console.log(paymentupdated.penalty_amount);
                let paymentHistoryDetails = {
                    received_amount: cheques.amount,
                    received_amount_date: bouncedDetails.status_date,
                    payment_id: cheques.payment_id,
                    payment_via_id: cheques.Payment.payment_via_id,
                    status: "Bounced",
                    cheque_id: cheques.id,
                    remark: req.body.remark,
                    user_id:cheques.Payment.user_id
                }
                paymentHistory = await Payment_History.create(paymentHistoryDetails, { transaction: t });
                // console.log(cheques.amount);

            }

            else if (req.body.status == "Cleared") {

                let clearedDetails = {
                    status: req.body.status,
                    status_date: req.body.status_date ? req.body.status_date : Date.now(),
                    remark: req.body.remark
                }

                cheque = await Cheque.update(clearedDetails, { where: { id: req.params.chequeId }, returning: true, plain: true }, { transaction: t });
                //total_received_amount += (parseInt(cheques.Payment.receiving_amount) + parseInt(cheques.Payment.penalty_amount)) - parseInt(cheques.amount) ;
                let amt = (parseInt(cheques.Payment.receiving_amount) + parseInt(cheques.Payment.penalty_amount)) - parseInt(cheques.amount) ;
                 
                 
                let paymentDetails = {
                    ///received_amount: total_received_amount,
                    received_amount_date: clearedDetails.status_date,
                    payment_id: cheques.payment_id,
                    payment_via_id: cheques.Payment.payment_via_id,
                   // status: (cheques.Payment.remaining_amount - cheques.amount ) == 0 ? "Success" : "Pending",
                   status: cheques.Payment.remaining_amount  == 0 ? "Success" : "Pending",
                    remark: req.body.remark,
                    //remaining_amount: cheques.Payment.remaining_amount == 0 ? amt : (cheques.Payment.remaining_amount - cheques.amount)
                    
                    
                }
                //console.log(paymentDetails.remaining_amount); 
                payment = Payment.update(paymentDetails, { where: { id: cheques.payment_id } }, { transaction: t });

                let paymentHistoryDetails = {
                    received_amount: cheques.amount,
                    received_amount_date: clearedDetails.status_date,
                    payment_id: cheques.payment_id,
                    payment_via_id: cheques.Payment.payment_via_id,
                    // status: clearedDetails.status,
                    status: paymentDetails.status == "Success" ? "Success" : clearedDetails.status,
                    cheque_id: cheques.id,
                    remark: req.body.remark,
                    user_id:cheques.Payment.user_id
                }
                paymentHistory = await Payment_History.create(paymentHistoryDetails, { transaction: t });

            } else {
                throw "Cheque updation error";
            }
        }

            return res.status(200).json({
                success: true,
                message: "cheque updated successfully.",
                cheque: cheque,
                payment: payment,
                paymentHistory: paymentHistory,

            });
        });

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error updating the cheque.",
            error: error
        })
    }
}

// Deleting the cheque
exports.delete = async (req, res) => {
    try {
        const cheque = await Cheque.destroy({ where: { id: req.params.chequeId } });
        return res.status(200).json({
            success: true,
            message: "cheque deleted successfully.",
            cheque: cheque
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error deleting the cheque.",
            error: error
        })
    }
}