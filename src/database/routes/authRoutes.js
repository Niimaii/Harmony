import { Router } from 'express';
import authController from '../controllers/authController.js';

const router = Router();

router.get('/', authController.getUsers);
router.post('/report', authController.createReport);

export default router;
