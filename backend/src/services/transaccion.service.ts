import { pool } from '../config/db';

export interface RegistrarTransaccionInput {
  numero_cuenta: string;
  fecha_transaccion: string;
  monto: number;
  codigo_operacion: string;
}

export async function registrarTransaccion(input: RegistrarTransaccionInput) {
  const { numero_cuenta, fecha_transaccion, monto, codigo_operacion } = input;

  if (!numero_cuenta || !fecha_transaccion || !codigo_operacion || monto === undefined) {
    return { codigo_respuesta: 1, descripcion_respuesta: 'Parámetros incompletos', id_transaccion: null };
  }

  if (Number(monto) <= 0) {
    return { codigo_respuesta: 2, descripcion_respuesta: 'El monto debe ser mayor a cero', id_transaccion: null };
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [cuentas] = await connection.query<any[]>(
      `SELECT id_cuenta, saldo, estatus
       FROM cuentas
       WHERE numero_cuenta = ?
       FOR UPDATE`,
      [numero_cuenta]
    );

    if (cuentas.length === 0) {
      await connection.rollback();
      return { codigo_respuesta: 3, descripcion_respuesta: 'La cuenta no existe', id_transaccion: null };
    }

    const cuenta = cuentas[0];
    if (cuenta.estatus !== 'ACTIVA') {
      await connection.rollback();
      return { codigo_respuesta: 4, descripcion_respuesta: 'La cuenta no está activa', id_transaccion: null };
    }

    const [codigos] = await connection.query<any[]>(
      `SELECT id_codigo_operacion, tipo_operacion, activo
       FROM codigos_operacion
       WHERE codigo_operacion = ?`,
      [codigo_operacion]
    );

    if (codigos.length === 0 || codigos[0].activo !== 1) {
      await connection.rollback();
      return { codigo_respuesta: 5, descripcion_respuesta: 'Código de operación inválido o inactivo', id_transaccion: null };
    }

    const codigo = codigos[0];
    const saldoAnterior = Number(cuenta.saldo);
    let saldoPosterior = saldoAnterior;

    if (codigo.tipo_operacion === 'CREDITO') {
      saldoPosterior = saldoAnterior + Number(monto);
    } else {
      if (saldoAnterior < Number(monto)) {
        await connection.rollback();
        return { codigo_respuesta: 6, descripcion_respuesta: 'Fondos insuficientes', id_transaccion: null };
      }
      saldoPosterior = saldoAnterior - Number(monto);
    }

    const [resultado] = await connection.query<any>(
      `INSERT INTO transacciones_cuenta
       (id_cuenta, id_codigo_operacion, monto, fecha_transaccion, saldo_anterior, saldo_posterior)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [cuenta.id_cuenta, codigo.id_codigo_operacion, monto, fecha_transaccion, saldoAnterior, saldoPosterior]
    );

    await connection.query(
      `UPDATE cuentas SET saldo = ? WHERE id_cuenta = ?`,
      [saldoPosterior, cuenta.id_cuenta]
    );

    await connection.commit();
    return { codigo_respuesta: 0, descripcion_respuesta: 'OK', id_transaccion: resultado.insertId };
  } catch (error) {
    await connection.rollback();
    return { codigo_respuesta: 99, descripcion_respuesta: 'Error interno al registrar la transacción', id_transaccion: null };
  } finally {
    connection.release();
  }
}

export async function consultarTransaccionesCliente(clienteId: number, fechaInicio: string, fechaFin: string) {
  const [rows] = await pool.query(
    `SELECT
        t.id_transaccion,
        c.numero_cuenta,
        cli.nombre_completo AS nombre_cliente,
        t.fecha_transaccion,
        t.monto,
        co.codigo_operacion,
        co.descripcion AS descripcion_transaccion,
        co.tipo_operacion
     FROM transacciones_cuenta t
     INNER JOIN cuentas c ON c.id_cuenta = t.id_cuenta
     INNER JOIN clientes cli ON cli.id_cliente = c.id_cliente
     INNER JOIN codigos_operacion co ON co.id_codigo_operacion = t.id_codigo_operacion
     WHERE cli.id_cliente = ?
       AND t.fecha_transaccion BETWEEN ? AND ?
     ORDER BY t.fecha_transaccion DESC`,
    [clienteId, fechaInicio, fechaFin]
  );
  return rows;
}
