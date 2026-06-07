export interface Project {
  id: string;
  timestamp: string;
  telegramUsername: string;
  telegramId: string;
  websiteUrl: string;
}

export interface SubmissionPayload {
  projectName: string;
  telegramUsername: string;
  telegramId: string;
  websiteUrl: string;
  description?: string;
  consent: boolean;
}
