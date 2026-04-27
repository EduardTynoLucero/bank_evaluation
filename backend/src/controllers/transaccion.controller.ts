import { Request, Response } from 'express';
import { consultarTransaccionesCliente, registrarTransaccion } from '../services/transaccion.service';

export async function postRegistrarTransaccion(req: Request, res: Response) {
  const respuesta = await registrarTransaccion(req.body);
  const status = respuesta.codigo_respuesta === 0 ? 201 : 400;
  return res.status(status).json(respuesta);
}

export async function getTransaccionesCliente(req: Request, res: Response) {
  const clienteId = Number(req.params.clienteId);
  const { fecha_inicio, fecha_fin } = req.query;

  if (!clienteId || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ codigo_respuesta: 1, descripcion_respuesta: 'clienteId, fecha_inicio y fecha_fin son obligatorios' });
  }

  const fechaInicio = `${fecha_inicio} 00:00:00`;
  const fechaFin = `${fecha_fin} 23:59:59`;
  const data = await consultarTransaccionesCliente(clienteId, fechaInicio, fechaFin);
  return res.json(data);
}
