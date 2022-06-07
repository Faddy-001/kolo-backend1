const { User,Department,Address,Feature_Access_Permission,Role,Module_Permission,User_Permission,Feature,Project,Module } = require("../models");
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
var ejs = require("ejs");
var path = require('path');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_SERVICE_HOST,
    port: process.env.SMTP_SERVICE_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER_NAME,
        pass: process.env.SMTP_USER_PASSWORD
    }
});


exports.signIn = async (req, res) => {
    return new Promise((resolve, reject) => {
        try {
            User.findOne({ where: { [Op.or]: [{ email: req.body.username }, { phone: req.body.username }], is_active: true },                
                include: [
                    { model: Role, include: [
                        {model: Module_Permission},
                        {model:Feature_Access_Permission, include:[ 
                            {model:Feature, attributes:['id','name'], include:[ 
                                {model:Module}
                            ]}
                        ]}
                    ]},
                    {model: Project, attributes: ['id', 'name']}                    
                  ]})        
            .then(async (user) => {
                if (!user) {
                    resolve(false);
                    return res.status(400).json({ success: false, error: "Invalid Username" });
                } else {
                    if (!user.dataValues.password || !await user.validPassword(req.body.password, user.dataValues.password)) {
                        resolve(false);
                        return res.status(401).json({ success: false, error: "Invalid password" });
                    } else {
                        resolve(user);
                        const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: "8h" });
                        return res.json({ 
                            success: true, 
                            token, 
                            user: user,
                        });
                    }
                }
            })
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                success: false, error: "User does not exists"
            });
        }
    })
};

exports.signout = (req, res) => {
    res.cookie("token", '', { expiresIn: "8h" });
    res.clearCookie("token");

    res.json({
        success: true,
        message: "User signout successfully"
    });
};


exports.forgotPassword = async (req, res) => {
    try {
        crypto.randomBytes(32, (err, buffer) => {
            if (err) {
                console.log(err);
            }
            const token = buffer.toString("hex")
            User.findOne({
                where: {
                    [Op.or]: [
                        { email: req.body.username },
                        { phone: req.body.username }
                    ]
                }
            }).then(users => {
                if (!users) {
                    res.status(404).json({
                        success: false,
                        message: "Invalid Username Please try With Valid UserName"
                    });
                    return "Mismacth";
                }

                users.expireToken = Date.now() + 3600000
                users.resetPasswordToken = token
                users.save().then((result) => {
                    ejs.renderFile(path.join(__dirname, "../views/index.ejs"),
                        {
                            userName: users.name,
                            token: token,
                            url: process.env.FRONTEND_BASE_URL
                        })
                        .then(emailTemplate => {

                            transporter.sendMail({
                                to: users.email,
                                from: "Kolonizer",
                                subject: "Password Reset",
                                html: emailTemplate

                            })
                        })
                    res.status(200).json({
                        success: true,
                        message: "Successfully send reset-password-link mail"
                    })
                })
            })
        })

    } catch (error) {
        console.log(error);
        return res.status(400).json({
            success: false,
            message: "Failed to reset Password.",
            error: error
        })
    }
}



exports.newPassword = async (req, res) => {

    const newPassword = req.body.password
    const sentToken = req.body.token

    User.findOne({
        where: { resetPasswordToken: sentToken }
    }).then(user => {
        if (!user) {
            return res.status(422).json({
                error: "user reset token existed"

            })

        }
        const salt = bcrypt.genSaltSync(10, 'a');
        user.password = bcrypt.hashSync(newPassword, salt);
        user.resetPasswordToken = null
        user.expireToken = null

        user.save().then((saveduser) => {
            res.json({
                message: "Password Updated success"
            })
        })
    }).catch(err => {
        console.log(err);
    })
}



exports.verfiyToken = (req, res) => {
    // const headers = req.headers.authorization;
    // if (headers) {
    //   const token = headers.split(' ')[1];
    jwt.verify(req.body.token, process.env.SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({
                success: false,
                error: err
            });
        }
    });


    return res.status(200).json({
        success: true,
        message: "Successfully Verified"
    })
}


