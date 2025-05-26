import React from "react";
import "../styles.css";

const Downloads = () => {
  const handleDownload = (format) => {
    window.open(`http://localhost:8000/download?format=${format}`, "_blank");
  };

  return (
    <div className="page-container">
      <h1>Download Data</h1>
      <button onClick={() => handleDownload("csv")}>Download CSV</button>
      <button onClick={() => handleDownload("excel")}>Download Excel</button>
    </div>
  );
};

export default Downloads;
