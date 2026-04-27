import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'evaluation-api.belsoftinc.net';

type RegistroForm = {
  numero_cuenta: string;
  fecha_transaccion: string;
  monto: string;
  codigo_operacion: string;
};

type ConsultaForm = {
  clienteId: string;
  fecha_inicio: string;
  fecha_fin: string;
};

function App() {
  const [registro, setRegistro] = useState<RegistroForm>({
    numero_cuenta: '001-000001',
    fecha_transaccion: new Date().toISOString().slice(0, 16),
    monto: '100',
    codigo_operacion: 'DEP',
  });

  const [respuestaRegistro, setRespuestaRegistro] = useState<any>(null);
  const [saldos, setSaldos] = useState<any[]>([]);
  const [consulta, setConsulta] = useState<ConsultaForm>({
    clienteId: '1',
    fecha_inicio: '2026-04-01',
    fecha_fin: '2026-04-30',
  });
  const [transacciones, setTransacciones] = useState<any[]>([]);
  const [cargandoRegistro, setCargandoRegistro] = useState(false);
  const [cargandoSaldos, setCargandoSaldos] = useState(false);
  const [cargandoTransacciones, setCargandoTransacciones] = useState(false);
  const [errorGeneral, setErrorGeneral] = useState('');

  useEffect(() => {
    cargarSaldos();
    consultarTransaccionesManual();
  }, []);

  async function registrarTransaccion(event: React.FormEvent) {
    event.preventDefault();
    setCargandoRegistro(true);
    setErrorGeneral('');

    try {
      const response = await fetch(`${API_URL}/transacciones`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...registro,
          fecha_transaccion: registro.fecha_transaccion.replace('T', ' ') + ':00',
          monto: Number(registro.monto),
        }),
      });

      const data = await response.json();
      setRespuestaRegistro(data);

      if (data.codigo_respuesta === 0) {
        await cargarSaldos();
        await consultarTransaccionesManual();
      }
    } catch (error) {
      setErrorGeneral('No fue posible conectar con el API. Verifique que el backend esté corriendo en el puerto 3000.');
    } finally {
      setCargandoRegistro(false);
    }
  }

  async function cargarSaldos() {
    setCargandoSaldos(true);
    setErrorGeneral('');

    try {
      const response = await fetch(`${API_URL}/cuentas/saldos`);
      setSaldos(await response.json());
    } catch (error) {
      setErrorGeneral('No fue posible consultar saldos. Verifique la conexión con el backend.');
    } finally {
      setCargandoSaldos(false);
    }
  }

  async function consultarTransacciones(event: React.FormEvent) {
    event.preventDefault();
    await consultarTransaccionesManual();
  }

  async function consultarTransaccionesManual() {
    setCargandoTransacciones(true);
    setErrorGeneral('');

    try {
      const url = `${API_URL}/transacciones/cliente/${consulta.clienteId}?fecha_inicio=${consulta.fecha_inicio}&fecha_fin=${consulta.fecha_fin}`;
      const response = await fetch(url);
      setTransacciones(await response.json());
    } catch (error) {
      setErrorGeneral('No fue posible consultar transacciones. Verifique la conexión con el backend.');
    } finally {
      setCargandoTransacciones(false);
    }
  }

  return (
    <main className="container">
      <header className="hero">
        <div>
          <span className="badge">Evaluación </span>
          <h1>Evaluación Bancaria</h1>
          <p className="subtitle">Transacciones Bancarias.</p>
        </div>
      </header>

      {errorGeneral && <div className="error-box">{errorGeneral}</div>}

      <section className="card">
        <div className="section-header">
          <div>
            <span className="section-number">1</span>
            <h2>Registrar transacción</h2>
          </div>
          <p>Al registrar correctamente, los saldos y transacciones se actualizan automáticamente.</p>
        </div>

        <form onSubmit={registrarTransaccion} className="grid">
          <label>
            Número de cuenta
            <input value={registro.numero_cuenta} onChange={e => setRegistro({ ...registro, numero_cuenta: e.target.value })} />
          </label>

          <label>
            Fecha transacción
            <input type="datetime-local" value={registro.fecha_transaccion} onChange={e => setRegistro({ ...registro, fecha_transaccion: e.target.value })} />
          </label>

          <label>
            Monto
            <input type="number" min="0.01" step="0.01" value={registro.monto} onChange={e => setRegistro({ ...registro, monto: e.target.value })} />
          </label>

          <label>
            Código operación
            <input value={registro.codigo_operacion} onChange={e => setRegistro({ ...registro, codigo_operacion: e.target.value.toUpperCase() })} />
          </label>

          <button type="submit" disabled={cargandoRegistro}>
            {cargandoRegistro ? 'Registrando...' : 'Registrar transacción'}
          </button>
        </form>

        {respuestaRegistro && (
          <div className={respuestaRegistro.codigo_respuesta === 0 ? 'success-box' : 'error-box'}>
            <strong>{respuestaRegistro.codigo_respuesta === 0 ? 'Transacción registrada correctamente' : 'Error al registrar transacción'}</strong>
            <p>{respuestaRegistro.descripcion_respuesta}</p>
            {respuestaRegistro.id_transaccion && <p>ID transacción: {respuestaRegistro.id_transaccion}</p>}
          </div>
        )}
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <span className="section-number">2</span>
            <h2>Listado de saldos</h2>
          </div>
        </div>

        <button onClick={cargarSaldos} disabled={cargandoSaldos}>
          {cargandoSaldos ? 'Consultando...' : 'Consultar saldos'}
        </button>

        <Table data={saldos} emptyMessage="No hay saldos para mostrar." />
      </section>

      <section className="card">
        <div className="section-header">
          <div>
            <span className="section-number">3</span>
            <h2>Transacciones por cliente y rango de fechas</h2>
          </div>
        </div>

        <form onSubmit={consultarTransacciones} className="grid">
          <label>
            Código cliente
            <input value={consulta.clienteId} onChange={e => setConsulta({ ...consulta, clienteId: e.target.value })} />
          </label>

          <label>
            Fecha inicio
            <input type="date" value={consulta.fecha_inicio} onChange={e => setConsulta({ ...consulta, fecha_inicio: e.target.value })} />
          </label>

          <label>
            Fecha fin
            <input type="date" value={consulta.fecha_fin} onChange={e => setConsulta({ ...consulta, fecha_fin: e.target.value })} />
          </label>

          <button type="submit" disabled={cargandoTransacciones}>
            {cargandoTransacciones ? 'Consultando...' : 'Consultar transacciones'}
          </button>
        </form>

        <Table data={transacciones} emptyMessage="No hay transacciones para mostrar." />
      </section>
    </main>
  );
}

function Table({ data, emptyMessage }: { data: any[]; emptyMessage: string }) {
  if (!data || data.length === 0) return <p className="empty">{emptyMessage}</p>;

  const columns = Object.keys(data[0]);

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>{columns.map(col => <th key={col}>{formatColumn(col)}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map(col => <td key={col}>{formatValue(row[col])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatColumn(column: string) {
 return column.replace(/_/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}

function formatValue(value: any) {
  if (value === null || value === undefined) return '';
  return String(value);
}

createRoot(document.getElementById('root')!).render(<App />);
