import { Request, Response } from 'express';
import { consultarSaldos } from '../services/cuenta.service';

export async function getSaldos(_req: Request, res: Response) {
  const data = await consultarSaldos();
  return res.json(data);
}
