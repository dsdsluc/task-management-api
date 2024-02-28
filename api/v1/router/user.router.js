const express = require('express');
const router = express.Router();
const controller = require("../controller/user.controller");
const authMiidleware = require("../../v1/middleware/auth.middleware");

router.post('/register', controller.register);

router.post('/login', controller.login);

router.post('/password/forgot', controller.forgotPassword);

router.post('/password/otp', controller.otpPassword);

router.post('/password/reset', controller.resetPassword);

router.get('/detail',authMiidleware.requireAuth, controller.detail);





module.exports = router