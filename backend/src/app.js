const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors')


const dotenv = require('dotenv');
const envFile = process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev';
dotenv.config({ path:  envFile });


//Employe Api Route
const authRoutes = require('./routes/api/auth');
const clinicianProfileRoutes = require('./routes/api/clinician/profile');
const clinicianVisitRoutes = require('./routes/api/clinician/visit');
const patientProfileRoutes = require('./routes/api/patient/profile');
const patientVisitRoutes = require('./routes/api/patient/visit');


const app = express();
const router = express.Router();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload());
app.use(express.static(path.resolve('./public')))
app.use(cors())

app.use(router)

app.use(authRoutes);
app.use(clinicianProfileRoutes);
app.use(clinicianVisitRoutes);

app.use(patientProfileRoutes);
app.use(patientVisitRoutes);


module.exports = app;