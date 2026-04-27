import { Router } from 'express';
import { getSaldos } from '../controllers/cuenta.controller';

const router = Router();
router.get('/saldos', getSaldos);
export default router;
