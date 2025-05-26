import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";
import News from "./pages/News";
import Downloads from "./pages/Downloads";
import Contact from "./pages/Contact";
import "./styles.css";
import Footer from "./components/Footer";
import Statistics from "./pages/Statistics";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        {/* Header with animated background */}
        <header className="header">
          <h1 className="website-title">Diabetes Knowledge Graph</h1>
        </header>

        {/* Sticky Navigation Bar */}
        <nav className="navbar">
          <ul className="nav-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/news">News</Link></li>
            <li><Link to="/downloads">Downloads</Link></li>
            <li><Link to="/statistics">Statistics</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </nav>

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
            <p>© 2024 Diabetes Knowledge Graph. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;


