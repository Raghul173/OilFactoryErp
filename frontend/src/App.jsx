import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthGateway } from './components/AuthGateway';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { AiAnalyticsModule } from './components/AIAnalyticsModule';
import { ProductionModule } from './components/ProductionModule';
import { InventoryModule } from './components/InventoryModule';
import { SupplierModule } from './components/SupplierModule';
import { SalesModule } from './components/SalesModule';
import { EmployeeModule } from './components/EmployeeModule';
import { ReportsModule } from './components/ReportsModule';
import { CustomCursor } from './components/CustomCursor';

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return (
      <>
        <CustomCursor />
        <AuthGateway />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard setActiveTab={setActiveTab} />;
      case 'ai-analytics':
        return <AiAnalyticsModule />;
      case 'production':
        return <ProductionModule />;
      case 'inventory':
        return <InventoryModule />;
      case 'suppliers':
        return <SupplierModule />;
      case 'sales':
        return <SalesModule />;
      case 'employees':
        return <EmployeeModule />;
      case 'reports':
        return <ReportsModule />;
      default:
        return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 print:bg-white print:text-black print:min-h-0 print:block">
      <CustomCursor />
      <Navbar />
      <div className="flex flex-1 overflow-hidden print:block print:overflow-visible">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-65px)] print:p-0 print:m-0 print:max-h-none print:overflow-visible print:block print:w-full">
          <div className="max-w-7xl mx-auto space-y-6 print:max-w-none print:w-full print:p-0 print:m-0 print:space-y-0">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <MainLayout />
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
