import { useState } from 'react';
import { motion } from 'framer-motion';
import { Hero } from './components/Hero';
import { ProjectGrid } from './components/ProjectGrid';
import { SubmissionForm } from './components/SubmissionForm';
import { useProjects } from './hooks/useProjects';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { projects, isLoading, error, refetch } = useProjects();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleSuccess = () => {
    refetch();
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-indigo-500 selection:text-white pb-20">
      {/* Floating submit button */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="fixed top-4 right-4 z-50 flex items-center gap-3"
      >
        <span className="hidden md:inline text-white text-sm">Are you a builder?</span>
        <motion.button
          onClick={handleOpenModal}
          title="Showcase Your Website"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-11 h-11 rounded-full bg-[#f5c518] text-[#0a0f1a] shadow-lg hover:bg-[#e0b015] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </motion.button>
      </motion.div>

      <main>
        <Hero onSubmitClick={handleOpenModal} />
        <ProjectGrid projects={projects} isLoading={isLoading} error={error} />
      </main>

      <SubmissionForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
}

export default App;
