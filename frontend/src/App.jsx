import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import News from "./pages/News";
import Downloads from "./pages/Downloads";
import Contact from "./pages/Contact";
import "./styles.css";
import Footer from "./components/Footer";
import Statistics from "./pages/Statistics";

// Navigation component with active link highlighting
const Navigation = () => {
  const location = useLocation();
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={location.pathname === "/" ? "active" : ""}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/search" 
              className={location.pathname === "/search" ? "active" : ""}
            >
              Search
            </Link>
          </li>
          <li>
            <Link 
              to="/news" 
              className={location.pathname === "/news" ? "active" : ""}
            >
              News
            </Link>
          </li>
          <li>
            <Link 
              to="/downloads" 
              className={location.pathname === "/downloads" ? "active" : ""}
            >
              Downloads
            </Link>
          </li>
          <li>
            <Link 
              to="/statistics" 
              className={location.pathname === "/statistics" ? "active" : ""}
            >
              Statistics
            </Link>
          </li>
          <li>
            <Link 
              to="/contact" 
              className={location.pathname === "/contact" ? "active" : ""}
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Header with animated background and IIITD logo */}
        <header className="header">
          <div className="header-brand">
            <img src="/IIITD.png" alt="IIITD" className="header-logo" />
            {/* <span className="brand-vrule" /> */}
           
          </div>
          <div className="header-content">
            <h1 className="website-title">Diabetes Knowledge Graph</h1>
            <p className="website-subtitle">Exploring the Complex World of Diabetes Research</p>
          </div>
        </header>

        {/* Navigation Bar */}
        <Navigation />

        {/* Main Content Area */}
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/news" element={<News />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <p>© 2025 Diabetes Knowledge Graph. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;


