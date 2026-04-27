USE banco_eval;

INSERT INTO clientes (nombre_completo, dpi, fecha_nacimiento, sexo, pais_nacimiento) VALUES
('Juan Carlos Pérez López', '1234567890101', '1990-05-15', 'M', 'Guatemala'),
('María Fernanda Gómez Ruiz', '2234567890102', '1988-09-21', 'F', 'Guatemala'),
('Luis Alberto Morales Díaz', '3234567890103', '1995-01-10', 'M', 'Guatemala');

INSERT INTO productos (nombre_producto, tasa_interes, tipo_producto, calculo_interes) VALUES
('Cuenta de Ahorro Clásica', 2.5000, 'AHORRO', 'MENSUAL'),
('Cuenta Monetaria Básica', 0.0000, 'MONETARIO', 'DIARIO'),
('Cuenta de Ahorro Plus', 3.7500, 'AHORRO', 'DIARIO');

INSERT INTO cuentas (numero_cuenta, id_producto, id_cliente, estatus, saldo) VALUES
('001-000001', 1, 1, 'ACTIVA', 1500.00),
('001-000002', 2, 1, 'ACTIVA', 750.00),
('001-000003', 1, 2, 'ACTIVA', 3000.00),
('001-000004', 3, 3, 'INACTIVA', 500.00);

INSERT INTO codigos_operacion (codigo_operacion, descripcion, tipo_operacion) VALUES
('DEP', 'Depósito en cuenta', 'CREDITO'),
('NCR', 'Nota de crédito', 'CREDITO'),
('RET', 'Retiro de cuenta', 'DEBITO'),
('NDB', 'Nota de débito', 'DEBITO'),
('PAG', 'Pago de servicio', 'DEBITO');
