import express from 'express'
import {addMechanic,allMechanic,loginAdmin} from '../controller/AdminController.js'
import upload from '../middleware/Multer.js'
import authAdmin from '../middleware/AuthAdmin.js';
import { changeAvailability } from '../controller/MechanicController.js';

const adminRouter = express.Router();

adminRouter.post('/add-mechanic',authAdmin, upload.single('image'),addMechanic) 
adminRouter.post('/login',loginAdmin)  //middlware handle this 
adminRouter.get('/all-mechanic',authAdmin,allMechanic)
adminRouter.post('/change-availability',authAdmin,changeAvailability)

export default adminRouter