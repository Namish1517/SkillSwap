import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ArrowRightLeft, Moon, Sun } from "lucide-react";
import LandingPage from "./pages/LandingPage";
import ProfileSetup from "./pages/ProfileSetup";
import Discover from "./pages/Discover";
import Matches from "./pages/Matches";
import Dashboard from "./pages/Dashboard";
import { SkillSwapProvider } from "./context/SkillSwapContext";
import { AuthProvider, useAuth } from "./context/AuthContext";

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="container text-center" style={{ paddingTop: "3rem" }}>
        <h2>Checking session...</h2>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const Navigation = ({ theme, onToggleTheme }) => {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const inApp = currentPath !== "/";

  return (
    <nav className="navbar">
      <NavLink to="/" className="nav-logo">
        <ArrowRightLeft size={28} />
        <span>SkillSwap</span>
      </NavLink>
      <div className="nav-links">
        <button
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
        >
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>
        {inApp && (
          <>
            <NavLink
              to="/discover"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Discover
            </NavLink>
            <NavLink
              to="/matches"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Matches
            </NavLink>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `nav-link ${isActive ? "active" : ""}`
              }
            >
              Profile
            </NavLink>
            {user && (
              <button className="btn btn-outline" onClick={signOut}>
                Sign Out
              </button>
            )}
          </>
        )}
        {currentPath === "/" && (
          <>
            {user ? (
              <>
                <NavLink to="/discover" className="nav-link">
                  Discover
                </NavLink>
                <button className="btn btn-outline" onClick={signOut}>
                  Sign Out
                </button>
              </>
            ) : (
              <span className="nav-link">Sign in to start matching</span>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem("skillswap-theme");
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("skillswap-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <SkillSwapProvider>
          <div className="app-shell">
            <Navigation theme={theme} onToggleTheme={toggleTheme} />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route
                  path="/profile"
                  element={
                    <RequireAuth>
                      <ProfileSetup />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/discover"
                  element={
                    <RequireAuth>
                      <Discover />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/matches"
                  element={
                    <RequireAuth>
                      <Matches />
                    </RequireAuth>
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    <RequireAuth>
                      <Dashboard />
                    </RequireAuth>
                  }
                />
              </Routes>
            </main>
          </div>
        </SkillSwapProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
