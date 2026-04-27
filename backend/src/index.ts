import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cuentaRoutes from './routes/cuenta.routes';
import transaccionRoutes from './routes/transaccion.routes';

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'OK' }));
app.use('/api/cuentas', cuentaRoutes);
app.use('/api/transacciones', transaccionRoutes);

app.listen(port, () => {
  console.log(`API escuchando en puerto ${port}`);
});
