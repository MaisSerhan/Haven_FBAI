// استدعاء الحزم الأساسية
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

// إنشاء التطبيق
const app = express();

// تفعيل CORS للسماح بالاتصال من الفرونت
app.use(cors());

// middlewares أساسية
app.use(logger('dev'));
app.use(express.json()); // لدعم JSON
app.use(express.urlencoded({ extended: true })); // لدعم بيانات form
app.use(cookieParser());

// الملفات الثابتة (صور، CSS، JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// استدعاء المسارات (Routes)
const userApi = require('./Modules/User/Route/user_route');
const authApi = require('./Modules/Authentication/Route/Auth_route');
const fileApi = require('./Modules/Files/Route/files_route');
const medicalApi = require('./Modules/Medical_Clinics/Route/medical_clinics_route');
const wheelsApi = require('./Modules/Wheels/Route/wheels_route');
const citiesApi = require('./Modules/Cities/Route/cities_route');
const vaccinesApi = require('./Modules/Vaccines/Route/vaccins_route');
const scheduleApi = require('./Modules/doctor_weekly_scheduale/Route/schedule_route');
const appointmentApi = require('./Modules/Appointments/Route/appointments_route');
const doctorApi = require('./Modules/Doctors/Route/doctors_route');
//const autoApi = require('./Modules/Auto/Route/auto_route'); // ✅ جديد

// تفعيل المسارات في التطبيق
app.use('/user', userApi);
app.use('/auth', authApi);
app.use('/file', fileApi);
app.use('/medical', medicalApi);
app.use('/wheel', wheelsApi);
app.use('/city', citiesApi);
app.use('/vaccine', vaccinesApi);
app.use('/schedule', scheduleApi);
app.use('/appointment', appointmentApi);
app.use('/doctor', doctorApi);
//app.use('/auto', autoApi); // ✅ جديد

// فيو إنجن في حال تستخدم pug أو غيره
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// التعامل مع 404 إن لم يتم العثور على route
app.use(function (req, res, next) {
  next(createError(404));
});

// معالج الأخطاء
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // عرض صفحة الخطأ
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
