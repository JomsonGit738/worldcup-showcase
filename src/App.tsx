import { useState } from 'react';
import { Navbar } from './components/Navbar';
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
      <Navbar onSubmitClick={handleOpenModal} />
      
      {/* Navbar is fixed top, so we add padding for content below hero. Hero handles its own centering. */}
      <main className="pt-16">
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
