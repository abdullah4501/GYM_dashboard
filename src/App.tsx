import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VideoManagement from './components/VideoManagement';
import EbookManagement from './components/EbookManagement';
import CertificateManagement from './components/CertificateManagement';
import MemberManagement from './components/MemberManagement';
import PlansManagement from './components/PlansManagement';

type ActivePage = 'dashboard' | 'videos' | 'ebooks' | 'certificates' | 'members' | 'plans';

function App() {
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');

  const renderActivePage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'videos':
        return <VideoManagement />;
      case 'ebooks':
        return <EbookManagement />;
      case 'certificates':
        return <CertificateManagement />;
      case 'members':
        return <MemberManagement />;
      case 'plans':
        return <PlansManagement />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1 overflow-auto">
        {renderActivePage()}
      </main>
    </div>
  );
}

export default App;