import React, { useState } from "react";
import QueryInput from "../components/QueryInput";
import GraphDisplay from "../components/GraphDisplay";
import ResultsTable from "../components/ResultsTable";
import "../styles.css";

const Search = () => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  return (
    <div className="search-page-container">
      <div className="search-content-wrapper">
        {/* Query Input Section */}
        <div className="query-section">
          <QueryInput
            onResults={(data) => {
              console.log("Received Data in Search.jsx:", data);
              if (data.error) {
                setError(data.error);
                setResults(null);
              } else {
                setError(null);
                setResults(data);
              }
            }}
          />
        </div>

        {/* Error Display */}
        {error && (
          <div className="error-container">
            <p className="error-message">⚠️ {error}</p>
          </div>
        )}

        {/* Loading State */}
        {!results && !error && (
          <div className="loading-container">
            <p className="loading-message">⏳ Enter your query to explore the knowledge graph...</p>
          </div>
        )}

        {/* Results Section */}
        {results && (
          <div className="results-container">
            {/* Graph Visualization */}
            {results?.results?.graph && (
              <div className="graph-section">
                <h2 className="section-title">Knowledge Graph Visualization</h2>
                <div className="graph-container">
                  <GraphDisplay
                    visualizationData={results.results.graph}
                    setSelectedNode={setSelectedNode}
                  />
                </div>
              </div>
            )}

            {/* Node Details Panel */}
            {selectedNode && (
              <div className="node-details-panel">
                <h3 className="panel-title">Node Details</h3>
                <div className="node-details-content">
                  <div className="node-header">
                    <h4>{selectedNode.label}</h4>
                    <span className="node-type">{selectedNode.id}</span>
                  </div>
                  <div className="node-properties">
                    {Object.entries(selectedNode.properties).map(([key, value]) => (
                      <div key={key} className="property-item">
                        <span className="property-name">{key}:</span>
                        <span className="property-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Table Results */}
            {results?.results?.table && (
              <div className="table-section">
                <h2 className="section-title">Query Results</h2>
                <div className="table-container">
                  <ResultsTable tableData={results.results.table} />
                  <button 
                    onClick={() => downloadCsv(results.results.table, 'query_results.csv')}
                    className="download-button"
                  >
                    Download CSV
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Add the CSV download function
const downloadCsv = (data, filename) => {
  if (!data || data.length === 0) {
    console.warn("No data to download.");
    return;
  }

  const replacer = (key, value) => (value === null ? '' : value); // Handle null values
  const header = Object.keys(data[0]);
  const csv = [
    header.join(','), // CSV header
    ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
  ].join('\r\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default Search;

