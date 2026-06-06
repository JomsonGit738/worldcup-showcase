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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

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

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariantsDesktop = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2 } },
  };

  const modalVariantsMobile = {
    hidden: { y: '100%' },
    visible: { y: 0, transition: { duration: 0.3 } },
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-[rgba(0,0,0,0.75)] backdrop-blur-sm"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          ref={modalRef}
          className="bg-[#111827] border border-[#1e2d45] rounded-t-2xl md:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6"
          variants={isMobile ? modalVariantsMobile : modalVariantsDesktop}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {showSuccess ? (
            <div className="flex flex-col items-center text-center py-8">
              <motion.svg
                className="w-16 h-16 text-[#22c55e]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                <path d="M20 6L9 17l-5-5" />
              </motion.svg>
              <h3 className="text-lg font-bold text-white mt-4">Your project has joined the showcase!</h3>
              <p className="text-sm text-slate-400 mt-2">Refreshing the list...</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Join the Showcase</h2>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white text-xl font-light bg-transparent border-none p-0"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {apiError && (
                  <div className="bg-[#450a0a] border border-[#ef4444] text-[#fca5a5] text-sm rounded-lg p-3 mb-4">
                    {apiError}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Project Name</label>
                  <input
                    type="text"
                    placeholder="My World Cup Site"
                    {...register('projectName')}
                    className={`bg-[#0a0f1a] border ${errors.projectName ? 'border-red-500' : 'border-[#1e2d45]'} text-white placeholder:text-[#475569] rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:border-[#f5c518] transition-colors duration-150`}
                  />
                  {errors.projectName && (
                    <p className="mt-1 text-xs text-red-400">{errors.projectName.message?.toString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Telegram Username</label>
                  <input
                    type="text"
                    placeholder="@yourhandle"
                    {...register('telegramUsername')}
                    className={`bg-[#0a0f1a] border ${errors.telegramUsername ? 'border-red-500' : 'border-[#1e2d45]'} text-white placeholder:text-[#475569] rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:border-[#f5c518] transition-colors duration-150`}
                  />
                  {errors.telegramUsername && (
                    <p className="mt-1 text-xs text-red-400">{errors.telegramUsername.message?.toString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Telegram ID</label>
                  <input
                    type="text"
                    placeholder="123456789"
                    {...register('telegramId')}
                    className={`bg-[#0a0f1a] border ${errors.telegramId ? 'border-red-500' : 'border-[#1e2d45]'} text-white placeholder:text-[#475569] rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:border-[#f5c518] transition-colors duration-150`}
                  />
                  <p className="mt-1 text-xs text-slate-500">Find your ID via @userinfobot on Telegram</p>
                  {errors.telegramId && (
                    <p className="mt-1 text-xs text-red-400">{errors.telegramId.message?.toString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://yoursite.com"
                    {...register('websiteUrl')}
                    className={`bg-[#0a0f1a] border ${errors.websiteUrl ? 'border-red-500' : 'border-[#1e2d45]'} text-white placeholder:text-[#475569] rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:border-[#f5c518] transition-colors duration-150`}
                  />
                  {errors.websiteUrl && (
                    <p className="mt-1 text-xs text-red-400">{errors.websiteUrl.message?.toString()}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Short Description (optional)</label>
                  <textarea
                    rows={2}
                    placeholder="What makes your site unique?"
                    {...register('description')}
                    className={`bg-[#0a0f1a] border ${errors.description ? 'border-red-500' : 'border-[#1e2d45]'} text-white placeholder:text-[#475569] rounded-lg px-4 py-3 w-full text-sm focus:outline-none focus:border-[#f5c518] transition-colors duration-150`}
                  />
                  <div className="flex justify-between items-start mt-1">
                    <span className="text-xs text-red-400">{errors.description?.message?.toString()}</span>
                    <span className="text-xs text-slate-500 ml-auto">{description.length}/100</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 mt-4">
                  <input
                    type="checkbox"
                    {...register('consent', { required: true })}
                    className="mt-0.5 w-4 h-4 accent-[#f5c518]"
                  />
                  <label className="text-sm text-slate-400">
                    I confirm this is my own work and I agree to showcase it publicly.
                  </label>
                </div>
                {errors.consent && (
                  <p className="text-xs text-red-400 mt-1">You must agree before submitting</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#f5c518] hover:bg-[#e0b015] text-[#0a0f1a] font-semibold text-sm py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                >
                  {isSubmitting && (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-[#0a0f1a]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8z"></path>
                    </svg>
                  )}
                  Join the Showcase
                </button>
              </form>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
