import { pool } from '../config/db';

export async function consultarSaldos() {
  const [rows] = await pool.query(
    `SELECT
        c.numero_cuenta,
        cli.nombre_completo AS nombre_cliente,
        p.tipo_producto AS tipo_cuenta,
        p.tasa_interes,
        c.saldo,
        c.estatus
     FROM cuentas c
     INNER JOIN clientes cli ON cli.id_cliente = c.id_cliente
     INNER JOIN productos p ON p.id_producto = c.id_producto
     ORDER BY cli.nombre_completo, c.numero_cuenta`
  );
  return rows;
}
