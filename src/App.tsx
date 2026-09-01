import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/store/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import LandingPage from '@/pages/LandingPage';
import ReportPage from '@/pages/ReportPage';
import ComplaintResultPage from '@/pages/ComplaintResultPage';
import DashboardPage from '@/pages/DashboardPage';
import CityMapPage from '@/pages/CityMapPage';
import AgentsPage from '@/pages/AgentsPage';
import ComplaintsPage from '@/pages/ComplaintsPage';
import AdminPage from '@/pages/AdminPage';
import DemoPage from '@/pages/DemoPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 pt-16">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/report" element={<ReportPage />} />
              <Route path="/complaint/:id" element={<ComplaintResultPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/map" element={<CityMapPage />} />
              <Route path="/agents" element={<AgentsPage />} />
              <Route path="/complaints" element={<ComplaintsPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/demo" element={<DemoPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
