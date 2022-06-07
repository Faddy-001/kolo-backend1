const path = require('path');
const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
require('dotenv').config()
const { sequelize } = require('./models');
global.__basedir = __dirname + "/";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors())

const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');
const departmentRoutes = require('./routes/department');
const roleRoutes = require('./routes/role');
const authRoutes = require('./routes/auth');
const offerRoutes = require('./routes/offer');
const propertyTypeRoutes = require('./routes/propertyType');
const professionRoutes = require('./routes/profession');
const leadRoutes = require('./routes/lead');
const projectPropertyTypeRoutes = require('./routes/projectPropertyType');
const preBookingRoutes = require('./routes/preBooking');
const propertyRoutes = require('./routes/property');

const featureRoutes = require('./routes/feature');
const moduleRoutes = require('./routes/moduler');
const moduleFeatureRoutes = require('./routes/moduleFeature');
const modulePermissionRoutes = require('./routes/modulePermission');
const paymentViaRoutes = require('./routes/paymentVia');
const accessPermissionRoutes = require('./routes/accessPermission');
const customerRoutes        = require('./routes/customer');
const userPermissionRoutes = require('./routes/userPermission');
const chequeRoutes = require('./routes/cheque');
const installmentRoutes = require('./routes/installment');

app.use(bodyParser.json())
app.use(cookieParser());
app.use(cors())


app.get('/', (req, res) => {
    res.status(200).json({
        message: "Hello Kolonizer"
    })
})



app.use("/api", userRoutes);
app.use("/api", projectRoutes);
app.use("/api", departmentRoutes);
app.use("/api", roleRoutes);
app.use("/api", authRoutes);
app.use("/api", propertyTypeRoutes);
app.use("/api", professionRoutes);
app.use("/api", leadRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", projectPropertyTypeRoutes);
app.use("/api", offerRoutes);
app.use("/api", preBookingRoutes);
app.use("/api", propertyRoutes);
app.use("/api", featureRoutes);
app.use("/api", moduleRoutes);
app.use("/api", moduleFeatureRoutes);
app.use("/api", modulePermissionRoutes);
app.use("/api", paymentViaRoutes);
app.use("/api", accessPermissionRoutes);
app.use("/api", customerRoutes);
app.use("/api", userPermissionRoutes);
app.use("/api", chequeRoutes);
app.use("/api", installmentRoutes);

const port = (process.env.PORT || 4000)

//Starting a server
app.listen(port, async () => {
    console.log(`Example app listening at http://localhost:${port}`)
    try {
        await sequelize.sync();
        console.log('DATABASE SYNCED!');
    } catch (error) {
        console.log(error);
    }
})
