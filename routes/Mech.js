import express from 'express'
import upload from '../middleware/Multer.js'
import { mechRegister ,getMechanicsByCompany, getAllMechanics, deleteMechanic, loginMechanic, getMechProfile} from '../controller/MechController.js';
import protect from '../middleware/AuthMiddleware.js';
const router = express.Router();

router.post('/mechregister',upload.single('image'),mechRegister);


router.post("/login", loginMechanic);

router.get('/byCompany/:companyName', getMechanicsByCompany);

router.get('/all-mechanics', getAllMechanics); // Get all mechanics

router.delete("/delete-mechanic/:id", deleteMechanic);

router.get('/profile', protect, getMechProfile); // Protect this route with JWT auth


export default router;

