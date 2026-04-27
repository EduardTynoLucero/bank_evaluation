DROP DATABASE IF EXISTS banco_eval;
CREATE DATABASE banco_eval CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE banco_eval;

CREATE TABLE clientes (
    id_cliente BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    dpi VARCHAR(20) NOT NULL UNIQUE,
    fecha_nacimiento DATE NOT NULL,
    sexo ENUM('M','F') NOT NULL,
    pais_nacimiento VARCHAR(80) NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE productos (
    id_producto BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre_producto VARCHAR(100) NOT NULL,
    tasa_interes DECIMAL(7,4) NOT NULL DEFAULT 0.0000,
    tipo_producto ENUM('AHORRO','MONETARIO') NOT NULL,
    calculo_interes ENUM('DIARIO','MENSUAL') NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE cuentas (
    id_cuenta BIGINT AUTO_INCREMENT PRIMARY KEY,
    numero_cuenta VARCHAR(30) NOT NULL UNIQUE,
    id_producto BIGINT NOT NULL,
    id_cliente BIGINT NOT NULL,
    estatus ENUM('ACTIVA','INACTIVA') NOT NULL DEFAULT 'ACTIVA',
    saldo DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    fecha_apertura DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_cuentas_productos FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    CONSTRAINT fk_cuentas_clientes FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    CONSTRAINT chk_cuentas_saldo CHECK (saldo >= 0)
);

CREATE TABLE codigos_operacion (
    id_codigo_operacion BIGINT AUTO_INCREMENT PRIMARY KEY,
    codigo_operacion VARCHAR(20) NOT NULL UNIQUE,
    descripcion VARCHAR(150) NOT NULL,
    tipo_operacion ENUM('CREDITO','DEBITO') NOT NULL,
    activo TINYINT(1) NOT NULL DEFAULT 1,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE transacciones_cuenta (
    id_transaccion BIGINT AUTO_INCREMENT PRIMARY KEY,
    id_cuenta BIGINT NOT NULL,
    id_codigo_operacion BIGINT NOT NULL,
    monto DECIMAL(15,2) NOT NULL,
    fecha_transaccion DATETIME NOT NULL,
    saldo_anterior DECIMAL(15,2) NOT NULL,
    saldo_posterior DECIMAL(15,2) NOT NULL,
    fecha_creacion DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transacciones_cuentas FOREIGN KEY (id_cuenta) REFERENCES cuentas(id_cuenta),
    CONSTRAINT fk_transacciones_codigos FOREIGN KEY (id_codigo_operacion) REFERENCES codigos_operacion(id_codigo_operacion),
    CONSTRAINT chk_transacciones_monto CHECK (monto > 0)
);

CREATE INDEX idx_cuentas_cliente ON cuentas(id_cliente);
CREATE INDEX idx_transacciones_cuenta_fecha ON transacciones_cuenta(id_cuenta, fecha_transaccion);
CREATE INDEX idx_transacciones_fecha ON transacciones_cuenta(fecha_transaccion);
