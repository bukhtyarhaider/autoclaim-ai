import React, { ReactNode } from 'react';
import ScanModal from '../../features/analysis/components/ScanModal';
import { useUI } from '../../context/UIContext';

import Breadcrumbs from '../common/Breadcrumbs';

interface AppLayoutProps {
  header: ReactNode;
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ header, children }) => {
  const { isScanModalOpen, closeScanModal } = useUI();

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col font-sans text-surface-900">
      
      {/* Top Header Slot */}
      <header className="h-16 bg-black border-b border-zinc-800 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between shadow-sm">
        {header}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <Breadcrumbs />
        {children}
      </main>

      {/* Global Modals */}
      <ScanModal 
        isOpen={isScanModalOpen} 
        onClose={closeScanModal} 
      />
    </div>
  );
};

export default AppLayout;
