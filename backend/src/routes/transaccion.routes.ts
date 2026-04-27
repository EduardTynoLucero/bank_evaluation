import { Router } from 'express';
import { getTransaccionesCliente, postRegistrarTransaccion } from '../controllers/transaccion.controller';

const router = Router();
router.post('/', postRegistrarTransaccion);
router.get('/cliente/:clienteId', getTransaccionesCliente);
export default router;
