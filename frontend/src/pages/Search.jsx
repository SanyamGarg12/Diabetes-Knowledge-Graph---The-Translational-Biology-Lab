import React, { useState } from "react";
import QueryInput from "../components/QueryInput";
import GraphDisplay from "../components/GraphDisplay";
import ResultsTable from "../components/ResultsTable";
import "../styles.css";

const Search = () => {
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null); // Store selected node

  return (
    <div className="search-container">
      <h1 className="page-title">Interactive Knowledge Graph</h1>

      {/* Query Input */}
      <div className="query-input-container">
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

      {/* Display Error if Any */}
      {error && <p className="error-message">⚠️ {error}</p>}

      {/* Loading Message */}
      {!results && !error && <p>⏳ Waiting for query input...</p>}

      {/* Graph and Node Details */}
      <div className="graph-info-container">
        {/* Graph Display */}
        {results?.results?.graph && (
          <div className="graph-visualization-section">
            <h2>Knowledge Graph Visualization</h2>
            <div className="graph-canvas-wrapper">
              <GraphDisplay
                visualizationData={results.results.graph}  // Ensure proper structure
                setSelectedNode={setSelectedNode}  // Pass the function to update the selected node
              />
            </div>
          </div>
        )}

        {/* Node Details */}
        {selectedNode && (
          <div className="node-details">
            <h3>Node Details</h3>
            <div>
              <p><strong>ID:</strong> {selectedNode.id}</p>
              <p><strong>Label:</strong> {selectedNode.label}</p>
              {/* Display all properties of the node */}
              {Object.keys(selectedNode.properties).map((key) => (
                <p key={key}><strong>{key}:</strong> {selectedNode.properties[key]}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Table Data */}
      {results?.results?.table && (
        <div>
          <h2>Table Data</h2>
          <ResultsTable tableData={results.results.table} />
        </div>
      )}
    </div>
  );
};

export default Search;

