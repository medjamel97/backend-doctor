import express from 'express';
import {addDoctor, addPatient, login, findAllDoctors} from '../controllers/user.js'


const router = express.Router();

router
    .route('/login')
    .post(login);
router
    .route('/register/patient')
    .post(addPatient);
router
    .route('/register/doctor')
    .post(addDoctor);
router
    .route('/doctors')
    .get(findAllDoctors);
export default router;