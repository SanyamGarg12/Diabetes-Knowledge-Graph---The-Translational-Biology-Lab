import React, { useState, useEffect } from "react";
import "../styles.css";

const Downloads = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/files');
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      setFiles(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDownload = (filename) => {
    window.open(`http://localhost:8000/download/${filename}`, "_blank");
  };

  if (loading) {
    return (
      <div className="downloads-container">
        <div className="loading-message">Loading available files...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="downloads-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="downloads-container">
      <div className="downloads-grid">
        <div className="download-category">
          <h2>Available Datasets</h2>
          <p>Download the following CSV datasets for your research</p>
          <div className="files-list">
            {files.map((file, index) => (
              <div key={index} className="file-item">
                <span className="file-icon">📊</span>
                <div className="file-info">
                  <h3>{file.name}</h3>
                  <p>CSV • {file.size}</p>
                </div>
                <button
                  onClick={() => handleDownload(file.name)}
                  className="download-button"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;
