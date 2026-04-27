# Evaluación Desarrollador NodeJS

## 1. Modelo Entidad Relación

El modelo Entidad-Relación se encuentra en:

- `docs/modelo-er.pdf`
- `docs/modelo-er.dbml`

Entidades incluidas:

- clientes
- productos
- cuentas
- codigos_operacion
- transacciones_cuenta

Relaciones:

- clientes 1:N cuentas
- productos 1:N cuentas
- cuentas 1:N transacciones_cuenta
- codigos_operacion 1:N transacciones_cuenta

---

## 2. Scripts para creación de base de datos en MySQL

El script de creación de base de datos se encuentra en:

```bash
database/01_schema.sql
```

Este script crea la base de datos `banco_eval` y las tablas necesarias.

---

## 3. Scripts para inserción de datos de prueba

El script de datos de prueba se encuentra en:

```bash
database/02_seed_data.sql
```

Incluye datos para:

- clientes
- productos
- cuentas
- codigos_operacion

---

## 4. Proyecto NodeJS con APIs

El backend está en:

```bash
backend/
```

Tecnologías utilizadas:

- Node.js
- Express
- TypeScript
- MySQL
- mysql2
- dotenv
- cors

APIs desarrolladas:

### Registrar transacción

```http
POST /api/transacciones
```

Body ejemplo:

```json
{
  "numero_cuenta": "001-000001",
  "fecha_transaccion": "2026-04-25 10:30:00",
  "monto": 100,
  "codigo_operacion": "DEP"
}
```

Respuesta esperada:

```json
{
  "codigo_respuesta": 0,
  "descripcion_respuesta": "OK",
  "id_transaccion": 1
}
```

### Consultar saldos

```http
GET /api/cuentas/saldos
```

### Consultar transacciones por cliente

```http
GET /api/transacciones/cliente/:clienteId?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD
```

Ejemplo:

```http
GET /api/transacciones/cliente/1?fecha_inicio=2026-04-01&fecha_fin=2026-04-30
```

---

## 5. Versión de NodeJS

Utilizar Node.js versión 16 o mayor.

Verificar versión instalada:

```bash
node -v
```

---

## 6. Lenguaje utilizado

El backend fue desarrollado con TypeScript.

---

## 7. Parametrización de conexión a base de datos

La conexión a MySQL se parametriza en:

```bash
backend/.env
```

Ejemplo de configuración:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=banco_user
DB_PASSWORD=1234
DB_NAME=banco_eval
```

También se incluye:

```bash
backend/.env.example
```

---

## 8. URL donde se publicó la aplicación

Colocar aquí la URL de publicación:

```text
Frontend publicado: PENDIENTE_DE_COLOCAR_URL
Backend publicado: PENDIENTE_DE_COLOCAR_URL
```

Para pruebas locales:

```text
Frontend local: http://localhost:5173
Backend local: http://localhost:3000
```

---

## 9. Instrucciones para ejecutar localmente

### 1. Crear base de datos

Abrir MySQL Workbench y ejecutar en orden:

```sql
database/01_schema.sql
database/02_seed_data.sql
```

### 2. Configurar backend

Editar:

```bash
backend/.env
```

Con los datos de conexión de MySQL.

### 3. Ejecutar backend

```bash
cd backend
npm install
npm run dev
```

El backend quedará en:

```text
http://localhost:3000
```

### 4. Ejecutar frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

El frontend quedará en:

```text
http://localhost:5173
```

---

## Usuario MySQL sugerido para pruebas

Si se desea crear un usuario específico para el proyecto:

```sql
DROP USER IF EXISTS 'banco_user'@'localhost';
CREATE USER 'banco_user'@'localhost' IDENTIFIED BY '1234';
GRANT ALL PRIVILEGES ON banco_eval.* TO 'banco_user'@'localhost';
FLUSH PRIVILEGES;
```

Luego configurar el archivo `backend/.env` así:

```env
DB_USER=banco_user
DB_PASSWORD=1234
DB_NAME=banco_eval
```

---

## Estructura del proyecto

```text
evaluacion-desarrollador/
├── backend/
├── database/
│   ├── 01_schema.sql
│   └── 02_seed_data.sql
├── docs/
│   ├── modelo-er.pdf
│   └── modelo-er.dbml
├── frontend/
└── README.md
```
