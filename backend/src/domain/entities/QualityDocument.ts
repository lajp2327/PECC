export interface QualityDocument {
  id: string;
  name: string;
  category: string;
  filePath: string;
  version?: string;
  publishedAt: Date;
  isActive: boolean;
}
