const express = require('express');
const router = express.Router();

const ctrlStudent = require('../controllers/student.controller');
const jwtHelper = require('../config/jwtHelper');


//PROFILES
router.get('/studentprofile', jwtHelper.verifyJwtTokenStudent, ctrlStudent.studentProfile);
router.get('/studentprofile/:id', jwtHelper.verifyJwtTokenCompany, ctrlStudent.getStudentProfile);

module.exports = router;