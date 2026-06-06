import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { submissionSchema, type SubmissionFormData } from '../lib/validators';
import { motion, AnimatePresence } from 'framer-motion';

interface SubmissionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SubmissionForm: React.FC<SubmissionFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: { description: '' },
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const description = watch('description') ?? '';
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent scrolling when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      reset();
      setApiError(null);
      setShowSuccess(false);
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: SubmissionFormData) => {
    setApiError(null);
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.status === 201) {
        setShowSuccess(true);
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2000);
      } else if (res.status === 409) {
        setApiError('This website has already been showcased.');
      } else if (res.status === 429) {
        setApiError('Too many submissions. Try again later.');
      } else {
        setApiError('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setApiError('Something went wrong. Please try again.');
    }
  };

  // Determine if mobile (Tailwind will handle via classes, but we need different animation variants)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 0.6 },
  };

  const modalVariantsDesktop = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const modalVariantsMobile = {
    hidden: { y: '100%' },
    visible: { y: 0, transition: { duration: 0.3 } },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black z-40"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      />

      {/* Modal container */}
      <motion.div
        ref={modalRef}
        className={
          isMobile
            ? 'fixed inset-x-0 bottom-0 z-50 bg-gray-900 rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto'
            : 'fixed inset-0 z-50 flex items-center justify-center'
        }
        variants={isMobile ? modalVariantsMobile : modalVariantsDesktop}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {isMobile ? null : (
          <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-lg mx-4">
            <div className="p-6">
              {/* Content goes here */}
            </div>
          </div>
        )}
        {/* For both layouts, render inside a padded container */}
        <div className={isMobile ? '' : 'p-6'}>
          {showSuccess ? (
            <div className="flex flex-col items-center text-center text-white">
              <motion.svg
                className="w-16 h-16 mb-4 text-green-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ scale: 0 }}
                animate={{ scale: 1, rotate: [0, 360] }}
                transition={{ duration: 0.8 }}
              >
                <path d="M20 6L9 17l-5-5" />
              </motion.svg>
              <h3 className="text-xl font-bold mb-2">Your project has joined the showcase!</h3>
              <p className="text-gray-300">Refreshing the list…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {apiError && (
                <div className="rounded bg-red-800 p-2 text-sm text-red-100 text-center">
                  {apiError}
                </div>
              )}

              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Project Name</label>
                <input
                  type="text"
                  placeholder="My World Cup Site"
                  {...register('projectName')}
                  className={`w-full rounded bg-gray-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.projectName ? 'border-red-500' : 'border-gray-700'}`}
                />
                {errors.projectName && (
                  <p className="mt-1 text-xs text-red-400">{errors.projectName.message?.toString() ?? 'Project name is required'}</p>
                )}
              </div>

              {/* Telegram Username */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Telegram Username</label>
                <input
                  type="text"
                  placeholder="@yourhandle"
                  {...register('telegramUsername')}
                  className={`w-full rounded bg-gray-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.telegramUsername ? 'border-red-500' : 'border-gray-700'}`}
                />
                {errors.telegramUsername && (
                  <p className="mt-1 text-xs text-red-400">{errors.telegramUsername.message?.toString() ?? 'Telegram username is required'}</p>
                )}
              </div>

              {/* Telegram ID */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Telegram ID</label>
                <input
                  type="text"
                  placeholder="123456789"
                  {...register('telegramId')}
                  className={`w-full rounded bg-gray-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.telegramId ? 'border-red-500' : 'border-gray-700'}`}
                />
                <p className="mt-1 text-xs text-gray-400">Find your ID via @userinfobot on Telegram</p>
                {errors.telegramId && (
                  <p className="mt-1 text-xs text-red-400">{errors.telegramId.message?.toString() ?? 'Telegram ID is required'}</p>
                )}
              </div>

              {/* Website URL */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Website URL</label>
                <input
                  type="url"
                  placeholder="https://yoursite.com"
                  {...register('websiteUrl')}
                  className={`w-full rounded bg-gray-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.websiteUrl ? 'border-red-500' : 'border-gray-700'}`}
                />
                {errors.websiteUrl && (
                  <p className="mt-1 text-xs text-red-400">{errors.websiteUrl.message?.toString() ?? 'Website URL is required'}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-1">Short Description (optional)</label>
                <textarea
                  rows={2}
                  placeholder="What makes your site unique?"
                  {...register('description')}
                  className={`w-full rounded bg-gray-800 border px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${errors.description ? 'border-red-500' : 'border-gray-700'}`}
                />
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-gray-400">{description.length}/100</span>
                  {errors.description && <span className="text-red-400">{errors.description.message?.toString()}</span>}
                </div>
              </div>

              {/* Consent */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  {...register('consent', { required: true })}
                  className="mt-1 mr-2 h-4 w-4 rounded border-gray-600 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="text-sm text-gray-200">
                  I confirm this is my own work and I agree to showcase it publicly.
                </label>
              </div>
              {errors.consent && (
                <p className="text-xs text-red-400">You must agree before submitting</p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 flex items-center justify-center disabled:opacity-50"
              >
                {isSubmitting && (
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
                  </svg>
                )}
                Join the Showcase
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
