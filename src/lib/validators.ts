import { z } from 'zod';

// Helper to strip leading @ from telegram username
const stripAt = (value: string) => value.replace(/^@/, '');

export const submissionSchema = z.object({
  telegramUsername: z.string().min(1, 'Telegram username required').max(100).transform(stripAt),
  telegramId: z.string().min(1, 'Telegram ID required').max(100),
  websiteUrl: z.string().min(1, 'Website URL required').max(100).url().refine((url) => /^https?:\/\//.test(url), {
    message: 'URL must start with http:// or https://',
  }),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree before submitting'
  }),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
