import React, { createContext, useState, useContext, useCallback } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const [modal, setModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmLabel: 'Confirmar',
    cancelLabel: 'Cancelar',
    onConfirm: () => {},
    onCancel: () => {},
    isDanger: false
  });

  // Display alert toast (closes automatically)
  const showAlert = useCallback((type, message, duration = 4000) => {
    setAlert({ type, message });
    
    // Auto-dismiss timeout
    const id = setTimeout(() => {
      setAlert(current => {
        // Only clear if it's the same alert
        if (current && current.message === message && current.type === type) {
          return null;
        }
        return current;
      });
    }, duration);

    return id;
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  // Display a confirmation modal
  const showConfirmModal = useCallback(({
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    onConfirm = () => {},
    onCancel = () => {},
    isDanger = false
  }) => {
    setModal({
      isOpen: true,
      title,
      message,
      confirmLabel,
      cancelLabel,
      onConfirm: () => {
        onConfirm();
        setModal(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        onCancel();
        setModal(prev => ({ ...prev, isOpen: false }));
      },
      isDanger
    });
  }, []);

  const hideModal = useCallback(() => {
    setModal(prev => {
      if (prev.onCancel) prev.onCancel();
      return { ...prev, isOpen: false };
    });
  }, []);

  const value = {
    alert,
    modal,
    showAlert,
    hideAlert,
    showConfirmModal,
    hideModal
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUICtx = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUICtx debe ser usado dentro de un UIProvider');
  }
  return context;
};
