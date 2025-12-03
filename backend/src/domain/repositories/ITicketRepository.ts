import { RMATicket } from '../entities/RMATicket';

export interface ITicketRepository {
  create(ticket: RMATicket): Promise<RMATicket>;
  findById(id: string): Promise<RMATicket | null>;
}
