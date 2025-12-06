import React, { ReactNode } from 'react';

interface AppLayoutProps {
  sidebar: ReactNode;
  header: ReactNode;
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ sidebar, header, children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-surface-50 flex font-sans text-surface-900">
      {/* Sidebar Slot */}
      {React.isValidElement(sidebar) && React.cloneElement(sidebar as React.ReactElement<any>, { 
        mobileOpen: isSidebarOpen, 
        onClose: () => setIsSidebarOpen(false) 
      })}

      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-64 flex flex-col min-h-screen transition-all duration-300">
        
        {/* Top Header Slot */}
        <header className="h-16 bg-white border-b border-surface-200 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between shadow-sm">
          {React.isValidElement(header) && React.cloneElement(header as React.ReactElement<any>, {
            onMenuClick: () => setIsSidebarOpen(true)
          })}
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
