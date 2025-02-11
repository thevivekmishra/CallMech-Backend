import express from 'express'
import { mechRegister ,getMechanicsByCompany } from '../controller/MechController.js';

const router = express.Router();

router.post('/mechregister',mechRegister);

router.get('/byCompany/:companyName', getMechanicsByCompany);

export default router;

