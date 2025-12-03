const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export type AuthResponse = { token: string };
export type TicketResponse = {
  ticket: any;
  uploadedEvidence?: string[];
};

export async function login(email: string): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error('No se pudo autenticar');
  }

  return response.json();
}

export async function createTicket(token: string, payload: FormData): Promise<TicketResponse> {
  const response = await fetch(`${API_BASE_URL}/api/tickets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: payload,
  });

  if (!response.ok) {
    const message = await response.json().catch(() => ({ message: 'Error al crear ticket' }));
    throw new Error(message.message || 'Error al crear ticket');
  }

  return response.json();
}

export async function fetchTicket(token: string, id: string) {
  const response = await fetch(`${API_BASE_URL}/api/tickets/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Ticket no encontrado');
  return response.json();
}
