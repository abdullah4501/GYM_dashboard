import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import VideoManagement from './components/VideoManagement';
import EbookManagement from './components/EbookManagement';
import CertificateManagement from './components/CertificateManagement';
import MemberManagement from './components/MemberManagement';
import PlansManagement from './components/PlansManagement';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 flex">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/videos" element={<VideoManagement />} />
            <Route path="/ebooks" element={<EbookManagement />} />
            <Route path="/certificates" element={<CertificateManagement />} />
            <Route path="/members" element={<MemberManagement />} />
            <Route path="/plans" element={<PlansManagement />} />
          </Routes>
        </main>
      </div>
      <Toaster position="top-right" />
    </Router>
  );
}

export default App;
