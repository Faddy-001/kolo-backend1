const { Lead, Project, User, Lead_Log, sequelize, Property, PropertyType, Pre_Booking, Image, Offer } = require("../models");
const { Op, where } = require("sequelize");
const { Parser, transforms: { unwind, flatten } } = require('json2csv');
const fs = require('fs');
const moment = require('moment');
var path = require('path');
const csv = require("fast-csv");

exports.getLead = async (req, res, next, id)=> {
    try {
        const lead = await Lead.findByPk(id, {include: [
                                                {model: Project, 
                                                    include: [
                                                        {model: PropertyType, attributes: ['id', 'name']}
                                                    ],attributes: ['id', 'name']},
                                                {model: User, as: 'CRE', attributes: ['id', 'name']}, 
                                                {model: User, as: 'Sales_Executive', attributes: ['id', 'name']},
                                                {model: Lead_Log,
                                                    include: [
                                                        {model: User, as: 'CRE', attributes: ['id', 'name']}, 
                                                        {model: User, as: 'Sales_Executive', attributes: ['id', 'name']}
                                                ]},
                                                {model: Pre_Booking, include: [
                                                    {model: Property},
                                                    {model: Image}
                                                ]}
                    ]});
        if (lead) {
            if(lead.Pre_Bookings != false) {
                for (let i = 0; i < lead.Pre_Bookings.length; i++) {
                    if(lead.Pre_Bookings[i].offer != null) {
                        var offers = [];
                        lead.Pre_Bookings[i].offer = lead.Pre_Bookings[i].offer.split(",").map(x=>+x);
                        for (let j = 0; j < lead.Pre_Bookings[i].offer.length; j++) {
                            let offer = await Offer.findByPk(lead.Pre_Bookings[i].offer[j]);
                            offers.push({'id': offer.id, 'name': offer.name, 'benefit': offer.benefit});
                        }
                        lead.Pre_Bookings[i].offer = offers;
                    }                    
                }
            }
            
            if(lead.area_of_interest != null) {
                area_of_interests = [];
                lead.area_of_interest = lead.area_of_interest.split(",").map(x=>+x);
                for (let i = 0; i < lead.area_of_interest.length; i++) {
                    let propertyType = await PropertyType.findByPk(lead.area_of_interest[i], {attributes: ['id','name']});
                    area_of_interests.push(propertyType);
                }
                lead.area_of_interest = area_of_interests;
            }
            req.lead = lead;
            next();
        } else {
            throw "Lead doesn't exists."
        }
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Lead doesn't exists.",
            error: error
        })
    }
}

exports.create = async (req, res)=> {
    try {
        var lead, lead_log = '';
        await sequelize.transaction(async (t) => {
            req.body.area_of_interest ? req.body.area_of_interest= req.body.area_of_interest.toString() : null;
            lead = await Lead.create(req.body, {transaction: t});
            req.body.lead_id= lead.id;
            lead_log = await Lead_Log.create(req.body, {transaction: t});
        })

        return res.status(200).json({
            success: true,
            message: "Lead created successfully",
            lead: lead,
            lead_log: lead_log
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error creating lead.",
           error: error
        })
    }
}

exports.findById = async (req, res)=> {
    try {
        return res.status(200).json({
            success: true,
            message: "Lead fetched successfully",
            lead: req.lead
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error fetching lead.",
           error: error
        })
    }
}

exports.fetchActive = async (req, res)=> {
    try {
        let projects = [];
        for (let i = 0; i< req.profile.Projects.length; i++) {
            projects.push(req.profile.Projects[i].id)
        }
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = 10;
        let where = { is_active: true };
        // if (req.query.project) {
        //     where.project_id = projects 
        // }
        if (!(req.profile.Role.name == 'Super Admin' || req.profile.Role.name == 'Admin')) {
            where.project_id = projects 
        }
        if (req.profile.Role.name == 'CRE') {
            where.cre_user_id = req.profile.id
        } 
        if (req.profile.Role.name == 'Sales Executive') {
            where.sales_exec_user_id = req.profile.id
        }

        const offset = page ? ((page-1)*limit) : 0;

        const leads = await Lead.findAndCountAll({
            where,
            include: [
                {model: Project, attributes: ['id', 'name']},
                {model: User, as: 'CRE', attributes: ['id', 'name']}, 
                {model: User, as: 'Sales_Executive', attributes: ['id', 'name']}
              ],
            order: [ ['created_at', 'DESC'] ],limit, offset 
        })

        for (let i = 0; i < leads.rows.length; i++) {
            if (!(leads.rows[i].area_of_interest == null || leads.rows[i].area_of_interest == '')) {
                area_of_interests = [];
                leads.rows[i].area_of_interest = leads.rows[i].area_of_interest.split(",").map(x=>+x);
                for (let j = 0; j < leads.rows[i].area_of_interest.length; j++) {
                    let propertyType = await PropertyType.findByPk(leads.rows[i].area_of_interest[j], {attributes: ['id','name']});
                    area_of_interests.push(propertyType);
                }
                leads.rows[i].area_of_interest = area_of_interests;
            }            
        }
        const totalPages = Math.ceil(leads.count / limit);

        return res.status(200).json({
            success: true,
            message: "Active Leads fetched successfully",
            count: leads.count,
            leads: leads.rows,
            page:page,
            totalPages:totalPages
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching active leads.",
            error: error
        })
    }
}

exports.fetchDeactive = async (req, res)=> {
    try {
        let projects = [];
        for (let i = 0; i< req.profile.Projects.length; i++) {
            projects.push(req.profile.Projects[i].id)
        }
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = 10;
        let where = { is_active: false };
        // if (req.query.project) {
        //     where.project_id = req.query.project 
        // }
        if (!(req.profile.Role.name == 'Super Admin' || req.profile.Role.name == 'Admin')) {
            where.project_id = projects 
        }
        if (req.profile.Role.name == 'CRE') {
            where.cre_user_id = req.profile.id
        } 
        if (req.profile.Role.name == 'Sales Executive') {
            where.sales_exec_user_id = req.profile.id
        }
        const offset = page ? ((page-1)*limit) : 0;

        const leads = await Lead.findAndCountAll({
            where,
            include: [
                {model: Project, attributes: ['id', 'name']},
                {model: User, as: 'CRE', attributes: ['id', 'name']}, 
                {model: User, as: 'Sales_Executive', attributes: ['id', 'name']}
              ],
            order: [ ['created_at', 'DESC'] ],limit, offset 
        })

        for (let i = 0; i < leads.rows.length; i++) {
            if (!(leads.rows[i].area_of_interest == null || leads.rows[i].area_of_interest == '')) {
                area_of_interests = [];
                leads.rows[i].area_of_interest = leads.rows[i].area_of_interest.split(",").map(x=>+x);
                for (let j = 0; j < leads.rows[i].area_of_interest.length; j++) {
                    let propertyType = await PropertyType.findByPk(leads.rows[i].area_of_interest[j], {attributes: ['id','name']});
                    area_of_interests.push(propertyType);
                }
                leads.rows[i].area_of_interest = area_of_interests;
            }            
        }
        const totalPages = Math.ceil(leads.count / limit);
        return res.status(200).json({
            success: true,
            message: "Deactive Leads fetched successfully",
            count: leads.count,
            leads: leads.rows,
            page:page,
            totalPages:totalPages
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching deactive leads.",
            error: error
        })
    }
}

exports.fetchUncalled = async (req, res)=> {
    try {
        let projects = [];
        for (let i = 0; i< req.profile.Projects.length; i++) {
            projects.push(req.profile.Projects[i].id)
        }
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = 10;
        let where = { [Op.and]: [ 
            { is_active: true },
            { [Op.or]: [
                { status: 'Lead' }, { status: ''}, { status: null}
            ]}
         ]};
        // if (req.query.project) {
        //     where.project_id = req.query.project 
        // }
        if (!(req.profile.Role.name == 'Super Admin' || req.profile.Role.name == 'Admin')) {
            where.project_id = projects 
        }
        if (req.profile.Role.name == 'CRE') {
            where.cre_user_id = req.profile.id
        } 
        if (req.profile.Role.name == 'Sales Executive') {
            where.sales_exec_user_id = req.profile.id
        }
        const offset = page ? ((page-1)*limit) : 0;

        const leads = await Lead.findAndCountAll({
            where,
            include: [
                {model: Project, attributes: ['id', 'name']},
                {model: User, as: 'CRE', attributes: ['id', 'name']}, 
                {model: User, as: 'Sales_Executive', attributes: ['id', 'name']}
              ],
            limit, offset 
        })

        for (let i = 0; i < leads.rows.length; i++) {
            if (!(leads.rows[i].area_of_interest == null || leads.rows[i].area_of_interest == '')) {
                area_of_interests = [];
                leads.rows[i].area_of_interest = leads.rows[i].area_of_interest.split(",").map(x=>+x);
                for (let j = 0; j < leads.rows[i].area_of_interest.length; j++) {
                    let propertyType = await PropertyType.findByPk(leads.rows[i].area_of_interest[j], {attributes: ['id','name']});
                    area_of_interests.push(propertyType);
                }
                leads.rows[i].area_of_interest = area_of_interests;
            }            
        }
        const totalPages = Math.ceil(leads.count / limit);
        return res.status(200).json({
            success: true,
            message: "Uncalled Leads fetched successfully",
            count: leads.count,
            leads: leads.rows,
            page:page,
            totalPages:totalPages
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error fetching uncalled leads.",
            error: error
        })
    }
}

exports.update = async (req, res)=> {
    try {
        var lead, lead_log = '';
        await sequelize.transaction(async (t) => {
            req.body.area_of_interest ? req.body.area_of_interest= req.body.area_of_interest.toString() : null;
            lead = await Lead.update(req.body, {where: {id: req.params.leadId}}, {transaction: t});
            req.body.lead_id= req.params.leadId;
            lead_log = await Lead_Log.create(req.body, {transaction: t});
        })

        return res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            lead: lead,
            lead_log: lead_log
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error updating leads.",
            error: error
        })
    }
}

exports.deactivate = async (req, res)=> {
    try {
        const lead = Lead.update({'is_active': false}, {where: {id: req.params.leadId}});
        return res.status(200).json({
            success: true,
            message: "Lead Deactivated Successfully.",
            lead: lead
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error Deactivating Lead.",
            error: error
        })
    }
}

exports.activate = async (req, res)=> {
    try {
        const lead = Lead.update({'is_active': true}, {where: {id: req.params.leadId}});
        return res.status(200).json({
            success: true,
            message: "Lead Activated Successfully.",
            lead: lead
        }) 
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Error Activating Lead.",
            error: error
        })
    }
}

exports.filter = async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = 10;
        const offset = page ? ((page-1)*limit) : 0;

        let cre                 = req.query.cre;
        let sales_exec          = req.query.sales_exec;
        let contactability      = req.query.contactability;        
        let call_start_date     = req.query.call_start_date;        
        let call_end_date       = req.query.call_end_date;
        let mode_of_interest    = req.query.mode_of_interest;
        let profession          = req.query.profession;
        let area_of_interest    = req.query.area_of_interest;
        let category            = req.query.category;
        let status              = req.query.status;
        let follow_up_date      = req.query.follow_up_date;
        let expected_visit_date = req.query.expected_visit_date;
        let lead_source         = req.query.lead_source;
        let project             = req.query.project;
        
        var filters = { where: {}, 
                        include: [
                            {model: Project, attributes: ['id', 'name']},
                            {model: User, as: 'CRE', attributes: ['id', 'name']}, 
                            {model: User, as: 'Sales_Executive', attributes: ['id', 'name']}
                        ], limit, offset,
                        order: [['created_at', 'DESC']]
                    };
        if (project) {
            filters.where.project_id = project
        }
        if(cre) {
            filters.where.cre_user_id = cre
        }
        if(call_start_date && call_end_date) {
            call_start_date = moment(call_start_date).format("YYYY-MM-DD 00:00:00").toString();
            call_end_date = moment(call_end_date).format("YYYY-MM-DD 00:00:00").toString();
            filters.where.call_datetime = { [Op.between]: [
                call_start_date, call_end_date
            ]}
        }
        if(sales_exec) {
            filters.where.sales_exec_user_id = sales_exec
        }
        if(contactability) {
            filters.where.contactability = contactability
        }        
        if(mode_of_interest) {
            filters.where.mode_of_interest = mode_of_interest
        }
        if(profession) {
            filters.where.profession = profession
        }
        if(area_of_interest) {
            filters.where.area_of_interest = area_of_interest
        }
        if(category) {
            filters.where.category = category
        }
        if(status) {
            filters.where.status = status
        }
        if(follow_up_date) {
            filters.where.follow_up_date = { [Op.like]: '%' + moment(follow_up_date).format("YYYY-MM-DD") + '%' }
        }
        if(expected_visit_date) {
            filters.where.expected_visit_date = { [Op.like]: '%' + moment(expected_visit_date).format("YYYY-MM-DD") + '%' }
        }
        if(lead_source) {
            filters.where.lead_source = lead_source
        }
        if (req.params.leadType == 'active') {
            filters.where.is_active = true
        }
        if (req.params.leadType == 'deactive') {
            filters.where.is_active = false
        }

        let leads = await Lead.findAndCountAll(filters);
        
        if (leads.rows.length > 0) {
            for (let i = 0; i < leads.rows.length; i++) {    
                if (!(leads.rows[i].area_of_interest == null || leads.rows[i].area_of_interest == '')) {
                    let area_of_interests = [];
                    leads.rows[i].area_of_interest = leads.rows[i].area_of_interest.split(",").map(x=>+x);
                    for (let j = 0; j < leads.rows[i].area_of_interest.length; j++) {                        
                        let propertyType = await PropertyType.findByPk(leads.rows[i].area_of_interest[j], {attributes: ['id','name']});                   
                        area_of_interests.push(propertyType);
                    }
                    leads.rows[i].area_of_interest = area_of_interests;
                }                                
            }     
        }            
        const totalPages = Math.ceil(leads.count / limit);
        return res.status(200).json({
            success: true,
            message: "Filtered leads fetched successfully.",
            count: leads.count,
            page:page,
            totalPages:totalPages,
            leads: leads.rows
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error filtering the leads.",
            error: error
        })
    }
}

exports.search = async (req, res)=> {
    try {
        let searchText = req.query.search;
        let where = {
            [Op.or]: [
                {phone:  { [Op.like]: '%' + searchText + '%' }},
                {first_name: { [Op.like]: '%' + searchText + '%' }},
                {middle_name:    { [Op.like]: '%' + searchText + '%' }},
                {last_name:  { [Op.like]: '%' + searchText + '%' }},
                {current_location:   { [Op.like]: '%' + searchText + '%' }},
                {buying_purpose: { [Op.like]: '%' + searchText + '%' }},
                {required_plot_size: { [Op.like]: '%' + searchText + '%' }},
                {contactability: { [Op.like]: '%' + searchText + '%' }},
                {mode_of_interest: { [Op.like]: '%' + searchText + '%' }},
                {living_mode: { [Op.like]: '%' + searchText + '%' }},
                {area_of_interest: { [Op.like]: '%' + searchText + '%' }},
                {budget: { [Op.like]: '%' + searchText + '%' }},
                {category: { [Op.like]: '%' + searchText + '%' }},
                {status: { [Op.like]: '%' + searchText + '%' }},
                {lead_source: { [Op.like]: '%' + searchText + '%' }},
            ]
        }
        if (req.params.leadType == 'active') {
            where.is_active = true
        }
        if (req.params.leadType == 'deactive') {
            where.is_active = false
        }
        if (req.params.leadType == 'uncalled') {
            where.is_active = true;
            where.status = 'Lead'
        }

        const leads = await Lead.findAll({
            where,
            include: [
                {model: Project, attributes: ['id', 'name']},
                {model: User, as: 'CRE', attributes: ['id', 'name']}, 
                {model: User, as: 'Sales_Executive', attributes: ['id', 'name']}
              ]
        })
        if (leads.length > 0) {
            for (let i = 0; i < leads.length; i++) {
                if (leads[i].area_of_interest != null) {
                    let area_of_interests = [];
                    leads[i].area_of_interest = leads[i].area_of_interest.split(",").map(x=>+x);
                    for (let j = 0; j < leads[i].area_of_interest.length; j++) {                        
                        let propertyType = await PropertyType.findByPk(leads[i].area_of_interest[j], {attributes: ['id','name']});                   
                        area_of_interests.push(propertyType);
                    }
                    leads[i].area_of_interest = area_of_interests;
                }                                    
            }     
        }            
        
        return res.status(200).json({
            success: true,
            message: "Leads filtered successfully.",
            leads: leads
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error searching the leads.",
            error: error
        })
    }
}

exports.exportCSV = async (req, res)=> {
    try {
        let where = {};
        if (req.params.leadType == 'active') {
            where.is_active = true
        }
        if (req.params.leadType == 'deactive') {
            where.is_active = false
        }
        let csv
        let cre                 = req.query.cre;
        let sales_exec          = req.query.sales_exec;
        let contactability      = req.query.contactability;        
        let call_start_date     = req.query.call_start_date;
        let call_end_date       = req.query.call_end_date;
        let mode_of_interest    = req.query.mode_of_interest;
        let profession          = req.query.profession;
        let area_of_interest    = req.query.area_of_interest;
        let category            = req.query.category;
        let status              = req.query.status;
        let follow_up_date      = req.query.follow_up_date;
        let expected_visit_date = req.query.expected_visit_date;
        let lead_source         = req.query.lead_source;
        let project             = req.query.project;
        if (project) {
            where.project_id = project
        }
        if(cre) {
            where.cre_user_id = cre
        }
        if(call_start_date && call_end_date) {
            where.call_datetime = {$between: [call_start_date, call_end_date]}
        }
        if(sales_exec) {
            where.sales_exec_user_id = sales_exec
        }
        if(contactability) {
            where.contactability = contactability
        }        
        if(mode_of_interest) {
            where.mode_of_interest = mode_of_interest
        }
        if(profession) {
            where.profession = profession
        }
        if(area_of_interest) {
            where.area_of_interest = area_of_interest
        }
        if(category) {
            where.category = category
        }
        if(status) {
            where.status = status
        }
        if(follow_up_date) {
            where.follow_up_date = follow_up_date
        }
        if(expected_visit_date) {
            where.expected_visit_date = expected_visit_date
        }
        if(lead_source) {
            where.lead_source = lead_source
        }
        

        let leads = await Lead.findAndCountAll({
            where,
            include: [
                {model: Project, attributes: ['name']},
                {model: User, as: 'CRE', attributes: ['name']}, 
                {model: User, as: 'Sales_Executive', attributes: ['name']},
                {model: Lead_Log, attributes: ['remark']}
              ],
            order: [ ['created_at', 'DESC'] ] 
        })

        for (let i = 0; i < leads.rows.length; i++) {
            if (!(leads.rows[i].area_of_interest == null || leads.rows[i].area_of_interest == '')) {
                area_of_interests = [];
                leads.rows[i].area_of_interest = leads.rows[i].area_of_interest.split(",").map(x=>+x);
                for (let j = 0; j < leads.rows[i].area_of_interest.length; j++) {
                    let propertyType = await PropertyType.findByPk(leads.rows[i].area_of_interest[j], {attributes: ['name']});
                    area_of_interests.push(propertyType.name);
                }
                leads.rows[i].area_of_interest = area_of_interests;
            }            
        }

        try {
            const fields = ['id', 'call_datetime', 'call_duration', {label: 'Project',value: 'Project.name'}, 
            {label: 'CRE',value: 'CRE.name'}, {label: 'Sales Executive',value: 'Sales_Executive.name'}, 'phone', 'first_name', 
            'middle_name', 'last_name', 'contactability', 'mode_of_interest', {label: 'Area of Interest', value: 'area_of_interest', default: ''},
            'current_location', 'living_mode', 'buying_purpose', 'required_plot_size','budget', 'category', 'status',
            'follow_up_date', 'expected_visit_date', 'lead_source', 'video_sent', 'is_active', {label: 'Lead Logs',value: 'Lead_Logs'}
            ];    
            const json2csvParser = new Parser({ fields });
            csv = json2csvParser.parse(leads.rows);
        } catch (err) {
            return res.status(500).json({ err });
        }

        const dateTime = moment().format('YYYYMMDDhhmmss');
        const filePath = await path.join(__dirname, "..", "public", "exports", "csv-" + dateTime + ".csv")
        //const filePath = path.join("C:", "Users", "admin", "Downloads", "csv-" + dateTime + ".csv")
        
        fs.writeFile(filePath, csv, async function  (err) {
            if (err) {
                return res.status(500).json({
                success: false,
                message: "fs write error",
                error: err
                });
            } else {
                setTimeout(function () {
                    fs.unlink(filePath, function (err) { // delete this file after 30 seconds
                    if (err) {
                        console.error(err);
                    }
                    console.log('File has been Deleted');
                    });
                }, 30000);
                res.download(filePath);
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error exporting active leads.",
            error: error
        })
    }
}

exports.importCSV = async (req, res)=> {
    try {
        if (req.file == undefined) {
            return res.status(400).send("Please upload a CSV file!");
        }
        let leads = [];
        let path = __basedir + "/uploads/" + req.file.filename;
        
        fs.createReadStream(path)
        .pipe(csv.parse({ headers: true }))
        .on("error", (error) => {
            throw error.message;
        })
        .on("data", async (row) => {         
            leads.push(row);
        })
        .on("end", () => {
            Lead.bulkCreate(leads)
            .then(() => {
                res.status(200).send({
                message:
                    "Uploaded the file successfully: " + req.file.originalname,
                });
            })
            .catch((error) => {
                res.status(500).send({
                message: "Fail to import data into database!",
                error: error.message,
                });
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Could not upload the file: " + req.file.originalname,
        });
    }
}

exports.todaysFollowUp = async (req, res)=> {
    try {
        let projects = [];
        for (let i = 0; i< req.profile.Projects.length; i++) {
            projects.push(req.profile.Projects[i].id)
        }
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = 10;
        const offset = page ? ((page-1)*limit) : 0;
       
        let where = {}
        if (req.profile.Role.name == 'CRE') {
                where.cre_user_id = req.profile.id,
                where.follow_up_date = { [Op.like]: '%' + moment(new Date()).format("YYYY-MM-DD") + '%' }   
        } else if (req.profile.Role.name == 'Sales Executive') {
                where.sales_exec_user_id = req.profile.id,
                where.expected_visit_date = { [Op.like]: '%' + moment(new Date()).format("YYYY-MM-DD") + '%' } 
        } else {
            where = { [Op.or]: [ 
                {follow_up_date: { [Op.like]: '%' + moment(new Date()).format("YYYY-MM-DD") + '%' }},
                {expected_visit_date: { [Op.like]: '%' + moment(new Date()).format("YYYY-MM-DD") + '%' }}  
            ]}            
        }
        // if (req.query.project) {
        //     where.project_id = req.query.project
        // }
        if (!(req.profile.Role.name == 'Super Admin' || req.profile.Role.name == 'Admin')) {
            where.project_id = projects 
        }
        if (req.profile.Role.name == 'CRE') {
            where.cre_user_id = req.profile.id
        } 
        if (req.profile.Role.name == 'Sales Executive') {
            where.sales_exec_user_id = req.profile.id
        }

        const leads = await Lead.findAndCountAll({ 
            where, 
            include: [
                {model: Project, attributes: ['id', 'name']},
                {model: User, as: 'CRE', attributes: ['id', 'name']}, 
                {model: User, as: 'Sales_Executive', attributes: ['id', 'name']}
            ],
            limit, offset 
        })

        for (let i = 0; i < leads.rows.length; i++) {
            if (!(leads.rows[i].area_of_interest == null || leads.rows[i].area_of_interest == '')) {
                area_of_interests = [];
                leads.rows[i].area_of_interest = leads.rows[i].area_of_interest.split(",").map(x=>+x);
                for (let j = 0; j < leads.rows[i].area_of_interest.length; j++) {
                    let propertyType = await PropertyType.findByPk(leads.rows[i].area_of_interest[j], {attributes: ['id','name']});
                    area_of_interests.push(propertyType);
                }
                leads.rows[i].area_of_interest = area_of_interests;
            }            
        }  
        const totalPages = Math.ceil(leads.count / limit);

        return res.status(200).json({
            success: true,
            message: "Today's Follow Up fetched successfully.",
            count: leads.count,
            page:page,
            totalPages:totalPages,
            leads: leads.rows            
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Error fetching Today's Follow Up.",
            error: error
        })
    }
}