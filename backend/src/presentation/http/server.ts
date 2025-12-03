import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { SqlTicketRepository } from '../../infrastructure/repositories/SqlTicketRepository';
import { RMATicket } from '../../domain/entities/RMATicket';
import { TicketStatus } from '../../domain/entities/TicketStatus';
import { AuthService, verifyToken } from '../../application/services/AuthService';
import { SatisfactionSurvey } from '../../domain/entities/SatisfactionSurvey';

const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(cors());
app.use(express.json());

const ticketRepository = new SqlTicketRepository();
const authService = new AuthService();

// Simple authentication middleware with JWT
function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing Authorization header' });

  const [, token] = authHeader.split(' ');
  if (!token) return res.status(401).json({ message: 'Invalid Authorization header' });

  try {
    const decoded = verifyToken(token);
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// POST /api/auth/login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const { email } = req.body;
  // TODO: validate password and fetch from persistence.
  const user = {
    id: randomUUID(),
    email,
    passwordHash: 'not-used-here',
    fullName: 'Cliente Externo',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const token = await authService.login(user);
  return res.json({ token });
});

// POST /api/tickets
app.post('/api/tickets', authenticate, upload.array('evidence', 5), async (req: Request, res: Response) => {
  const { title, problemType, description, priority = 'Media' } = req.body;
  const evidenceFiles = (req.files as Express.Multer.File[]) || [];

  // Placeholder for 8D/IATF validation (e.g., containment actions, root cause fields)
  if (!title || !description) {
    return res.status(400).json({ message: 'Title and description are required' });
  }

  const ticket: RMATicket = {
    id: randomUUID(),
    customerId: (req as any).user?.sub,
    title,
    problemType,
    description,
    priority,
    status: TicketStatus.Recibido,
    createdAt: new Date(),
    updatedAt: new Date(),
    history: [
      {
        status: TicketStatus.Recibido,
        changedAt: new Date(),
        changedBy: (req as any).user?.sub,
        notes: 'Ticket creado',
      },
    ],
  };

  await ticketRepository.create(ticket);

  // Future: sync to Dynamics 365 / Dataverse
  // await dynamics365Adapter.syncTicket(ticket);

  return res.status(201).json({ ticket, uploadedEvidence: evidenceFiles.map((f) => f.filename) });
});

// GET /api/tickets/:id
app.get('/api/tickets/:id', authenticate, async (req: Request, res: Response) => {
  const ticket = await ticketRepository.findById(req.params.id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

  return res.json({ ticket });
});

// POST /api/surveys
app.post('/api/surveys', authenticate, async (req: Request, res: Response) => {
  const { ticketId, rating, comments } = req.body as SatisfactionSurvey;
  if (!ticketId || !rating) return res.status(400).json({ message: 'ticketId and rating are required' });

  const ticket = await ticketRepository.findById(ticketId);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

  const survey: SatisfactionSurvey = {
    id: randomUUID(),
    ticketId,
    rating,
    comments,
    submittedAt: new Date(),
  };

  // Persist survey using repository/ORM in production.
  // The survey could also be synced to Dynamics 365 Customer Voice.

  // Update ticket status to closed if survey is submitted after closure validation.
  if (ticket.status !== TicketStatus.Cerrado) {
    ticket.status = TicketStatus.Cerrado;
    ticket.history.push({
      status: TicketStatus.Cerrado,
      changedAt: new Date(),
      changedBy: (req as any).user?.sub,
      notes: 'Cierre automático tras encuesta',
    });
  }

  return res.status(201).json({ survey, ticket });
});

// Minimal error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
});

export function startServer() {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`PECC API running on port ${port}`);
  });
}

if (require.main === module) {
  startServer();
}
