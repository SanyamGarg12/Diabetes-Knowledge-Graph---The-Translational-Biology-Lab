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

  // Helper functions for file categorization and formatting
  const getFileCategory = (filename) => {
    const name = filename.toLowerCase();
    if (name.includes('gene') || name.includes('protein') || name.includes('target')) {
      return 'Genes & Proteins';
    } else if (name.includes('disease') || name.includes('omim') || name.includes('mesh')) {
      return 'Diseases & Conditions';
    } else if (name.includes('drug') || name.includes('chemical') || name.includes('compound')) {
      return 'Drugs & Chemicals';
    } else if (name.includes('mirna') || name.includes('lnc') || name.includes('rna')) {
      return 'RNA & Non-coding';
    } else if (name.includes('pathway') || name.includes('go_') || name.includes('kegg')) {
      return 'Pathways & Functions';
    } else if (name.includes('interaction') || name.includes('pubtator')) {
      return 'Interactions & Networks';
    } else {
      return 'Other Datasets';
    }
  };

  const getCategoryDescription = (category) => {
    const descriptions = {
      'Genes & Proteins': 'Gene symbols, protein data, and target information',
      'Diseases & Conditions': 'Disease associations, medical conditions, and OMIM data',
      'Drugs & Chemicals': 'Drug compounds, chemical entities, and pharmacological data',
      'RNA & Non-coding': 'miRNA, lncRNA, and other non-coding RNA molecules',
      'Pathways & Functions': 'Biological pathways, GO terms, and functional annotations',
      'Interactions & Networks': 'Molecular interactions and network connectivity data',
      'Other Datasets': 'Additional research datasets and supplementary information'
    };
    return descriptions[category] || 'Research dataset files';
  };

  const getFileIcon = (filename) => {
    const name = filename.toLowerCase();
    if (name.includes('gene') || name.includes('protein')) {
      return '🧬';
    } else if (name.includes('disease') || name.includes('omim')) {
      return '🏥';
    } else if (name.includes('drug') || name.includes('chemical')) {
      return '💊';
    } else if (name.includes('mirna') || name.includes('rna')) {
      return '🧪';
    } else if (name.includes('pathway') || name.includes('go_')) {
      return '🔄';
    } else if (name.includes('interaction')) {
      return '🔗';
    } else {
      return '📊';
    }
  };

  const formatFileName = (filename) => {
    return filename
      .replace('.csv', '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
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

  // Categorize files by type
  const categorizedFiles = files.reduce((acc, file) => {
    const category = getFileCategory(file.name);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(file);
    return acc;
  }, {});

  return (
    <div className="downloads-container">
      <div className="downloads-header">
        <h1>Research Datasets</h1>
        <p>Download curated datasets for your biological research and analysis</p>
        <div className="downloads-stats">
          <span className="stat-item">
            <strong>{files.length}</strong> Files Available
          </span>
          <span className="stat-item">
            <strong>{Object.keys(categorizedFiles).length}</strong> Categories
          </span>
        </div>
      </div>

      <div className="downloads-grid">
        {Object.entries(categorizedFiles).map(([category, categoryFiles]) => (
          <div key={category} className="download-category">
            <div className="category-header">
              <h2>{category}</h2>
              <span className="file-count">{categoryFiles.length} files</span>
            </div>
            <p className="category-description">{getCategoryDescription(category)}</p>
            <div className="files-list">
              {categoryFiles.map((file, index) => (
                <div key={index} className="file-item">
                  <div className="file-icon-wrapper">
                    <span className="file-icon">{getFileIcon(file.name)}</span>
                  </div>
                  <div className="file-info">
                    <h3>{formatFileName(file.name)}</h3>
                    <div className="file-meta">
                      <span className="file-type">CSV</span>
                      <span className="file-size">{file.size}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(file.name)}
                    className="download-button"
                  >
                    <span className="download-icon">↓</span>
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Downloads;
