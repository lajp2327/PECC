import { TicketStatus } from './TicketStatus';

export interface StatusHistoryEntry {
  status: TicketStatus;
  changedAt: Date;
  changedBy?: string;
  notes?: string;
}

export interface RMATicket {
  id: string;
  customerId: string;
  title: string;
  problemType: string;
  description: string;
  priority: 'Baja' | 'Media' | 'Alta';
  status: TicketStatus;
  createdAt: Date;
  updatedAt: Date;
  history: StatusHistoryEntry[];
}
