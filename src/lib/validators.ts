import { z } from 'zod';

// Helper to strip leading @ from telegram username
const stripAt = (value: string) => value.replace(/^@/, '');

export const submissionSchema = z.object({
  telegramUsername: z.string().trim().min(1, 'Required').max(100).transform(stripAt),
  telegramId: z.string().trim().min(1, 'Required').max(100),
  websiteUrl: z.string().trim().url().min(1, 'Required').max(100).refine((url) => /^https?:\/\//.test(url), {
    message: 'URL must start with http:// or https://',
  }),
  consent: z.boolean().refine(val => val === true, {
    message: 'You must agree before submitting'
  }),
});

export type SubmissionFormData = z.infer<typeof submissionSchema>;
