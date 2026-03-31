import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ArrowRightLeft } from 'lucide-react';
import LandingPage from './pages/LandingPage';
import ProfileSetup from './pages/ProfileSetup';
import Discover from './pages/Discover';
import Matches from './pages/Matches';
import Dashboard from './pages/Dashboard';

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        <ArrowRightLeft size={28} />
        SkillSwap
      </Link>
      <div className="nav-links">
        {currentPath !== '/' && (
          <>
            <Link to="/discover" className={`nav-link ${currentPath === '/discover' ? 'active' : ''}`}>Discover</Link>
            <Link to="/matches" className={`nav-link ${currentPath === '/matches' ? 'active' : ''}`}>Matches</Link>
            <Link to="/dashboard" className={`nav-link ${currentPath === '/dashboard' ? 'active' : ''}`}>Dashboard</Link>
            <Link to="/profile" className={`nav-link ${currentPath === '/profile' ? 'active' : ''}`}>Profile</Link>
          </>
        )}
        {currentPath === '/' && (
          <>
            <Link to="/discover" className="nav-link">Log In</Link>
            <Link to="/profile" className="btn btn-primary">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<ProfileSetup />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
