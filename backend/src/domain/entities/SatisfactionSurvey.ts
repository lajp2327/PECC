export interface SatisfactionSurvey {
  id: string;
  ticketId: string;
  rating: number; // 1-5
  comments?: string;
  submittedAt: Date;
}
