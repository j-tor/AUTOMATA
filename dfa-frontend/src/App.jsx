import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DFAProvider } from './context/DFAContext';
import { UIProvider, useUICtx } from './context/UIContext';

// Import Pages
import Home from './components/pages/Home';
import Dashboard from './components/pages/Dashboard';
import CreateDFA from './components/pages/CreateDFA';
import DFADetailPage from './components/pages/DFADetailPage';
import UnionPage from './components/pages/UnionPage';
import TestStringPage from './components/pages/TestStringPage';
import NotFound from './components/pages/NotFound';

// Import Common Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Alert from './components/common/Alert';
import Modal from './components/common/Modal';

/**
 * Inner App component that consumes contexts after they are initialized
 */
function AppContent() {
  const { alert, hideAlert, modal, hideModal } = useUICtx();

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-slatebg-950">
        
        {/* Navigation Bar */}
        <Navbar />
        
        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-dfa" element={<CreateDFA />} />
            <Route path="/dfa/:id" element={<DFADetailPage />} />
            <Route path="/union" element={<UnionPage />} />
            <Route path="/test-string" element={<TestStringPage />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </main>
        
        {/* Footer */}
        <Footer />
        
        {/* Global Toast Notifications */}
        {alert && (
          <Alert 
            type={alert.type} 
            message={alert.message} 
            onClose={hideAlert} 
          />
        )}

        {/* Global Confirmation Modal */}
        <Modal
          isOpen={modal.isOpen}
          title={modal.title}
          confirmLabel={modal.confirmLabel}
          cancelLabel={modal.cancelLabel}
          onClose={hideModal}
          onConfirm={modal.onConfirm}
          isDanger={modal.isDanger}
        >
          <p>{modal.message}</p>
        </Modal>
      </div>
    </BrowserRouter>
  );
}

/**
 * Main Application Entry wrapped in Ctx Providers
 */
function App() {
  return (
    <UIProvider>
      <DFAProvider>
        <AppContent />
      </DFAProvider>
    </UIProvider>
  );
}

export default App;
