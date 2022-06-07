const { parse } = require('dotenv');
const { Customer, Customer_Property, Cheque, Payment_History, Payment, Payment_Via, Property, sequelize } = require('../models');

exports.update = async (req, res) => {

  //console.log(req.body);
  try {
    let payment;
    
    let customer_property = '';
    let id = req.params.installmentId;
    // let chequeId = NULL;
    // let transaction_id = NULL;
    let remaining_amount = 0.00;
    let total_pay_amount = 0.00;
    let total_receiving_amount = 0.00;
    let cheque = '';

    payment = await Payment.findByPk(id, { include: [{ model: Customer_Property }] }, { raw: true },);
    total_receiving_amount = (parseFloat(payment.receiving_amount) + parseFloat(payment.penalty_amount));
    remaining_amount = parseFloat(total_receiving_amount) - parseFloat(payment.received_amount);
    total_pay_amount = parseFloat(remaining_amount)+parseFloat(payment.penalty_amount);
  
    

    if(payment.status == "Success"){
      return res.status(200).json({
        success: false,
        message: "Installment  status already success.",
      })
    }

    let total_giving_amount = parseFloat(req.body.received_amount) + parseFloat(payment.received_amount);
  
    let paymentVia = await Payment_Via.findByPk(req.body.payment_via_id);

    if (total_giving_amount > total_receiving_amount) {

      return res.status(200).json({
        success: false,
        message: "Amount Is Greater than Installment.",
      })
    }
    //installment start here
    if (payment.Customer_Property.payment_type == 'installments') {
      
      if (req.body.payment_via === "Cash" ) {
          
        
        if ( total_giving_amount <= total_receiving_amount ) {

                  if (req.body.received_amount <=total_receiving_amount ) {
                  
            
                              let paymentdetails = {
                                received_amount: parseFloat(req.body.received_amount)+parseFloat(payment.received_amount),
                                received_amount_date: Date.now(),
                                payment_via_id: req.body.payment_via_id,
                                status: parseFloat(total_receiving_amount)==parseFloat(total_giving_amount) ? "Success":"Pending",
                                remaining_amount: parseFloat(remaining_amount)-parseFloat(req.body.received_amount),
                                remark: req.body.remark
                              }
                          
                          console.log(paymentdetails.status);
                          console.log(total_receiving_amount);
                          console.log(total_giving_amount);
                          paymentdetails = await Payment.update(paymentdetails, { where: { id: id } },)
                          
                          let paymentHistoryDetails = {
                            received_amount: req.body.received_amount,
                            received_amount_date: Date.now(),
                            payment_id: req.params.installmentId,
                            payment_via_id: req.body.payment_via_id,
                            status: "Success",
                            remark: req.body.remark,
                            user_id:payment.user_id
                          }
                          let paymenthistory = await Payment_History.create(paymentHistoryDetails);
                      //  } 
                        
                      //   } else {

                      //         let paymentdetails = {

                      //           received_amount: req.body.received_amount,
                      //           received_amount_date: Date.now(),
                      //           payment_via_id: req.body.payment_via_id,
                      //           status: "Success",
                      //           remark: req.body.remark
                      //         }
                      //         console.log(paymentdetails);
                      //         paymentdetails = await Payment.update(paymentdetails, { where: { id: id } },)


                      //             let paymentHistoryDetails = {

                      //               received_amount: req.body.received_amount,
                      //               received_amount_date: Date.now(),
                      //               payment_id: id,
                      //               payment_via_id: req.body.payment_via_id,
                      //               status: "Success",
                      //               remark: req.body.remark,
                      //               user_id:payment.user_id
                      //             }

                      //            let paymenthistory = await Payment_History.create(paymentHistoryDetails)
                  }  
          
        }

        //   console.log("Payment Via Cash");

      }
      else if (req.body.payment_via === 'Cheque') {
       
        console.log(payment.user_id);
        let chequeDetails = {
          type: req.body.type,
          number: req.body.number,
          date: Date.now(),
          amount: req.body.received_amount,
          payment_id: payment.id
        }

        cheque = await Cheque.create(chequeDetails);

        //console.log(chequeDetails.amount);
        let receivedAmt = (parseInt(payment.received_amount) + parseInt(chequeDetails.amount));
        let amt = (parseInt(payment.receiving_amount) - parseInt(chequeDetails.amount)) ;
        let amt2 =  (parseInt(payment.remaining_amount) - parseInt(chequeDetails.amount)) ;
        let paymentdetails = {
          received_amount: receivedAmt,
          received_amount_date: Date.now(),
          payment_via_id: req.body.payment_via_id,
          status: "Pending",
         // remaining_amount:,
         remaining_amount: payment.remaining_amount == 0 ? amt : amt2,
         remark: req.body.remark
        }
        // let remaining_amount = receiving_amount + penalty_amount;
        // let total_receiving_amount = remaining_amount+receiving_amount;
        paymentdetails = await Payment.update(paymentdetails, { where: { id: id } },)
       
        let paymentHistoryDetails = {
          received_amount: req.body.received_amount,
          received_amount_date: Date.now(),
          payment_id: payment.id,
          payment_via_id: req.body.payment_via_id,
          // status: req.body.payment_via != 'Cheque' ? "Success" : "Pending",
          status: "Pending",
          cheque_id: cheque.id,
          remark: req.body.remark,
          user_id:payment.user_id
        }
        const paymentHistory = await Payment_History.create(paymentHistoryDetails);


      }
      else if (req.body.payment_via === 'Online_Payment') {
         
        if(total_giving_amount <= total_receiving_amount){
       
          let onlinepaymentdetails = {
            received_amount: parseFloat(payment.received_amount) + parseFloat(req.body.received_amount),
            received_amount_date: Date.now(),
            remark: req.body.remark,
            remaining_amount: remaining_amount - req.body.received_amount,
            payment_via_id: req.body.payment_via_id,
            transaction_id:req.body.transaction_id,
            status: parseFloat(total_receiving_amount)==parseFloat(total_giving_amount) ? "Success":"Pending",
         
          }
      
         console.log(onlinepaymentdetails);
        
          if(onlinepaymentdetails.received_amount > total_receiving_amount){
        
            return res.status(200).json({
              success: false,
              message: "Amount Is Greater than Installment.",
            })

          }else{
            paymentdetails = await Payment.update(onlinepaymentdetails, { where: { id: id } },)

            console.log(paymentdetails);
                let paymentHistoryDetails = {
                    received_amount: req.body.received_amount,
                    received_amount_date: Date.now(),
                    payment_id: payment.id,
                    payment_via_id: req.body.payment_via_id,
                    status: req.body.payment_via != 'Cheque' ? "Success" : "Pending",
                    cheque_id: req.body.payment_via != 'Cheque' ? null : cheque.id,
                    remark: req.body.remark,
                    transaction_id:req.body.transaction_id,
                    user_id:payment.user_id
                  }
            const paymentHistory = await Payment_History.create(paymentHistoryDetails);
          }
    
        }

    } 
    
    
  }else if (payment.Customer_Property.payment_type == 'Full') {
      
      if (req.body.payment_via === "Cash" ) {
        
        if ( total_giving_amount <= total_receiving_amount ) {

          if (req.body.received_amount <=total_receiving_amount ) {
          
    
                      let paymentdetails = {
                        received_amount: parseFloat(req.body.received_amount)+parseFloat(payment.received_amount),
                        received_amount_date: Date.now(),
                        payment_via_id: req.body.payment_via_id,
                        status: parseFloat(total_receiving_amount)==parseFloat(total_giving_amount) ? "Success":"Pending",
                        remaining_amount: parseFloat(remaining_amount)-parseFloat(req.body.received_amount),
                        remark: req.body.remark
                      }
                  
                  console.log(paymentdetails.status);
                  console.log(total_receiving_amount);
                  console.log(total_giving_amount);
                  paymentdetails = await Payment.update(paymentdetails, { where: { id: id } },)
                  
                  let paymentHistoryDetails = {
                    received_amount: req.body.received_amount,
                    received_amount_date: Date.now(),
                    payment_id: req.params.installmentId,
                    payment_via_id: req.body.payment_via_id,
                    status: "Success",
                    remark: req.body.remark,
                    user_id:payment.user_id
                  }
                  let paymenthistory = await Payment_History.create(paymentHistoryDetails);
              //  } 
                
              //   } else {

              //         let paymentdetails = {

              //           received_amount: req.body.received_amount,
              //           received_amount_date: Date.now(),
              //           payment_via_id: req.body.payment_via_id,
              //           status: "Success",
              //           remark: req.body.remark
              //         }
              //         console.log(paymentdetails);
              //         paymentdetails = await Payment.update(paymentdetails, { where: { id: id } },)


              //             let paymentHistoryDetails = {

              //               received_amount: req.body.received_amount,
              //               received_amount_date: Date.now(),
              //               payment_id: id,
              //               payment_via_id: req.body.payment_via_id,
              //               status: "Success",
              //               remark: req.body.remark,
              //               user_id:payment.user_id
              //             }

              //            let paymenthistory = await Payment_History.create(paymentHistoryDetails)
  }  
  
}


      }
      else if (req.body.payment_via === 'Cheque') {
       
        console.log(payment.user_id);
        let chequeDetails = {
          type: req.body.type,
          number: req.body.number,
          date: Date.now(),
          amount: req.body.received_amount,
          payment_id: payment.id
        }

        cheque = await Cheque.create(chequeDetails);

        //console.log(chequeDetails.amount);
        let receivedAmt = (parseInt(payment.received_amount) + parseInt(chequeDetails.amount));
        let amt = (parseInt(payment.receiving_amount) - parseInt(chequeDetails.amount)) ;
        let amt2 =  (parseInt(payment.remaining_amount) - parseInt(chequeDetails.amount)) ;
        let paymentdetails = {
          received_amount: receivedAmt,
          received_amount_date: Date.now(),
          payment_via_id: req.body.payment_via_id,
          status: "Pending",
         // remaining_amount:,
         remaining_amount: payment.remaining_amount == 0 ? amt : amt2,
         remark: req.body.remark
        }
        // let remaining_amount = receiving_amount + penalty_amount;
        // let total_receiving_amount = remaining_amount+receiving_amount;
        paymentdetails = await Payment.update(paymentdetails, { where: { id: id } },)
       
        let paymentHistoryDetails = {
          received_amount: req.body.received_amount,
          received_amount_date: Date.now(),
          payment_id: payment.id,
          payment_via_id: req.body.payment_via_id,
          // status: req.body.payment_via != 'Cheque' ? "Success" : "Pending",
          status: "Pending",
          cheque_id: cheque.id,
          remark: req.body.remark,
          user_id:payment.user_id
        }
        const paymentHistory = await Payment_History.create(paymentHistoryDetails);


      }
      else if (req.body.payment_via === 'Online_Payment') {
        console.log("online");
        if(total_giving_amount <= total_receiving_amount){
          let onlinepaymentdetails = {
            received_amount: parseFloat(payment.received_amount) + parseFloat(req.body.received_amount),
            received_amount_date: Date.now(),
            remark: req.body.remark,
            remaining_amount: remaining_amount - req.body.received_amount,
            payment_via_id: req.body.payment_via_id,
            transaction_id:req.body.transaction_id,
            status: parseFloat(total_receiving_amount)==parseFloat(total_giving_amount) ? "Success":"Pending",
         
          }
          console.log(onlinepaymentdetails);
        
          if(onlinepaymentdetails.received_amount > total_receiving_amount){
        
            return res.status(200).json({
              success: false,
              message: "Amount Is Greater than Installment.",
            })

          } else{
            paymentdetails = await Payment.update(onlinepaymentdetails, { where: { id: id } },)

            console.log(paymentdetails);
                let paymentHistoryDetails = {
                    received_amount: req.body.received_amount,
                    received_amount_date: Date.now(),
                    payment_id: payment.id,
                    payment_via_id: req.body.payment_via_id,
                    status: req.body.payment_via != 'Cheque' ? "Success" : "Pending",
                    cheque_id: req.body.payment_via != 'Cheque' ? null : cheque.id,
                    remark: req.body.remark,
                    transaction_id:req.body.transaction_id,
                    user_id:payment.user_id
                }
            const paymentHistory = await Payment_History.create(paymentHistoryDetails);

          }

        }
      }
              
                   
    } else {
        console.log("Error Updating the installment.");
    }
  
    
    return res.status(200).json({
      success: true,
      message: "Successfully Updated Installment.",

    })

  } catch (error) {
    console.log(error);
      return res.status(400).json({
        success: false,
        message: "Error Updating the installment.",
        error: error
      })
  }
 


}
