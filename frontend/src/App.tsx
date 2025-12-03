import { useEffect, useMemo, useState } from 'react';
import CreateTicketForm from './components/CreateTicketForm';
import StatusTracker from './components/StatusTracker';
import SmartSurvey from './components/SmartSurvey';
import { createTicket, fetchTicket, login } from './api';
import './index.css';

type Ticket = {
  id: string;
  title: string;
  description: string;
  status: string;
  history?: { status: string; changedAt: string; notes?: string }[];
};

const fallbackTicket: Ticket = {
  id: 'demo-1234',
  title: 'RMA Demo',
  description: 'Ejemplo de ticket para visualizar el tracker',
  status: 'Acciones',
  history: [
    { status: 'Recibido', changedAt: new Date().toISOString(), notes: 'Ticket cargado' },
    { status: 'Análisis', changedAt: new Date().toISOString(), notes: 'Investigación en curso' },
    { status: 'Acciones', changedAt: new Date().toISOString(), notes: 'Implementando acciones' },
  ],
};

function safeStatus(status: string) {
  const allowed = ['Recibido', 'Análisis', 'Acciones', 'Cerrado'];
  return allowed.includes(status) ? status : 'Recibido';
}

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [ticket, setTicket] = useState<Ticket>(fallbackTicket);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusPointer, setStatusPointer] = useState(2);

  useEffect(() => {
    const authenticate = async () => {
      try {
        const auth = await login('demo@cliente.com');
        setToken(auth.token);
      } catch (err) {
        console.warn('No se pudo autenticar contra la API, se usará modo demo', err);
      }
    };
    authenticate();
  }, []);

  const currentStatus = useMemo(() => safeStatus(ticket?.status || 'Recibido'), [ticket]);

  const handleSubmitTicket = async (formData: FormData) => {
    setError(null);
    setLoading(true);
    try {
      if (token) {
        const response = await createTicket(token, formData);
        setTicket(response.ticket);
        setStatusPointer(stepsIndex(response.ticket.status));
      } else {
        const newTicket: Ticket = {
          ...fallbackTicket,
          id: crypto.randomUUID(),
          status: 'Recibido',
          title: formData.get('title') as string,
          description: formData.get('description') as string,
        };
        setTicket(newTicket);
        setStatusPointer(0);
      }
    } catch (err: any) {
      setError(err.message || 'Error al crear ticket');
    } finally {
      setLoading(false);
    }
  };

  const handleAdvance = async () => {
    const nextPointer = Math.min(statusPointer + 1, 3);
    setStatusPointer(nextPointer);
    const status = ['Recibido', 'Análisis', 'Acciones', 'Cerrado'][nextPointer];
    setTicket((prev) => ({ ...prev, status }));
    if (token && ticket?.id) {
      try {
        const refreshed = await fetchTicket(token, ticket.id);
        if (refreshed.ticket) {
          setTicket(refreshed.ticket);
          setStatusPointer(stepsIndex(refreshed.ticket.status));
        }
      } catch (err) {
        console.warn('No se pudo refrescar ticket, manteniendo estado local', err);
      }
    }
  };

  const handleSurveySubmit = (payload: { rating: number; comments?: string }) => {
    console.info('Feedback capturado', payload);
    alert('Gracias por tu feedback.');
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Portal de Experiencia del Cliente y Calidad</h1>
          <p className="text-sm text-gray-600">
            Crea RMAs, haz seguimiento de estatus y responde encuestas inteligentes.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${token ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {token ? 'Conectado a API' : 'Modo demo (sin backend)'}
          </span>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800">Registrar nuevo RMA</h2>
          <CreateTicketForm onSubmit={handleSubmitTicket} />
          {error && <p className="rounded bg-red-50 p-2 text-sm text-red-600">{error}</p>}
          {loading && <p className="text-sm text-blue-600">Enviando ticket...</p>}
        </div>

        <div className="space-y-4">
          <div className="rounded-md border bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Tracker de estatus</h3>
                <p className="text-xs text-gray-500">Recorrido visual estilo envío para tu RMA.</p>
              </div>
              <button
                onClick={handleAdvance}
                className="rounded bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                Avanzar estado
              </button>
            </div>
            <div className="mt-4">
              <StatusTracker status={currentStatus as any} />
            </div>
            <div className="mt-4 rounded bg-gray-50 p-3 text-xs text-gray-600">
              <p className="font-semibold text-gray-700">Ticket</p>
              <p>ID: {ticket?.id || 'N/A'}</p>
              <p>Descripción: {ticket?.description}</p>
              <p>Último estatus: {currentStatus}</p>
            </div>
          </div>

          <SmartSurvey ticketStatus={currentStatus} onSubmit={handleSurveySubmit} />
        </div>
      </div>
    </div>
  );
}

function stepsIndex(status: string) {
  return ['Recibido', 'Análisis', 'Acciones', 'Cerrado'].indexOf(status);
}

export default App;
