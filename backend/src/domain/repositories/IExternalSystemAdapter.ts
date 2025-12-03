import { RMATicket } from '../entities/RMATicket';

export interface IExternalSystemAdapter {
  syncTicket(ticket: RMATicket): Promise<void>;
}
