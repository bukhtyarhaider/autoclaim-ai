import React, { createContext, useContext, useState } from 'react';

interface UIContextType {
  isScanModalOpen: boolean;
  openScanModal: () => void;
  closeScanModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isScanModalOpen, setIsScanModalOpen] = useState(false);

  const openScanModal = () => setIsScanModalOpen(true);
  const closeScanModal = () => setIsScanModalOpen(false);

  return (
    <UIContext.Provider value={{ isScanModalOpen, openScanModal, closeScanModal }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
