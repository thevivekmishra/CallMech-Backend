import express from 'express'
import upload from '../middleware/Multer.js'
import { mechRegister ,getMechanicsByCompany } from '../controller/MechController.js';

const router = express.Router();

router.post('/mechregister',upload.single('image'),mechRegister);

router.get('/byCompany/:companyName', getMechanicsByCompany);

export default router;

