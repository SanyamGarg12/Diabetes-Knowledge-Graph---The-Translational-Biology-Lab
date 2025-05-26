import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import "../styles.css";

const QueryInput = ({ onResults }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  // Example query suggestions
  const exampleQueries = [
    "Show me genes associated with Type 2 Diabetes",
    "What proteins are encoded by the TCF7L2 gene?",
    "Find miRNAs that influence insulin resistance",
    "Show pathways related to glucose metabolism",
    "What drugs target the SLC2A4 gene?"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:8000/query", {
        params: { user_query: query },
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        onResults(response.data);
      }
    } catch (error) {
      setError("Failed to fetch results. Please try again.");
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  return (
    <motion.div 
      className="query-input-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="query-input-wrapper">
        <form onSubmit={handleSubmit} className="query-form">
          <div className="input-group">
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSuggestions(
                  exampleQueries.filter(q => 
                    q.toLowerCase().includes(e.target.value.toLowerCase())
                  )
                );
              }}
              onFocus={() => setSuggestions(exampleQueries)}
              onBlur={() => setTimeout(() => setSuggestions([]), 200)}
              placeholder="Enter your query..."
              className="query-input"
              required
            />
            <motion.button
              type="submit"
              disabled={loading}
              className="search-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {loading ? (
                <motion.div
                  className="loading-spinner"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                "Search"
              )}
            </motion.button>
          </div>

          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                className="suggestions-container"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                    whileHover={{ backgroundColor: "rgba(52, 152, 219, 0.1)" }}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {suggestion}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="example-queries">
          <h4>Example Queries:</h4>
          <div className="example-queries-list">
            {exampleQueries.map((example, index) => (
              <motion.button
                key={index}
                className="example-query-button"
                onClick={() => handleSuggestionClick(example)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {example}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default QueryInput;
