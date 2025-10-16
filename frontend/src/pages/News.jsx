import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

const News = () => {
  const [pubmedArticles, setPubmedArticles] = useState([]);
  const [clinicalTrials, setClinicalTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to format authors from PubMed API response
  const formatAuthors = (authors) => {
    if (!authors) return "Unknown authors";
    
    try {
      let authorList = [];
      
      // PubMed API typically returns authors as an array of objects or strings
      if (Array.isArray(authors)) {
        authorList = authors.map(author => {
          if (typeof author === 'string') {
            return author.trim();
          } else if (typeof author === 'object' && author !== null) {
            // Handle author object with name, lastname, forename, etc.
            if (author.name) {
              return author.name.trim();
            } else if (author.lastname && author.forename) {
              return `${author.forename} ${author.lastname}`.trim();
            } else if (author.lastname) {
              return author.lastname.trim();
            } else {
              // Try to extract any string value from the object
              const nameValues = Object.values(author).filter(val => 
                typeof val === 'string' && val.trim().length > 0 && val.length < 100
              );
              return nameValues.length > 0 ? nameValues[0].trim() : null;
            }
          }
          return null;
        }).filter(name => name !== null);
      } else if (typeof authors === 'string') {
        // Handle string format (comma or semicolon separated)
        authorList = authors.split(/[,;]/).map(author => author.trim());
      } else if (typeof authors === 'object' && authors !== null) {
        // Handle single author object
        if (authors.name) {
          authorList = [authors.name.trim()];
        } else if (authors.lastname && authors.forename) {
          authorList = [`${authors.forename} ${authors.lastname}`.trim()];
        } else if (authors.lastname) {
          authorList = [authors.lastname.trim()];
        }
      }
      
      // Clean up and limit the author names
      authorList = authorList
        .filter(name => name && typeof name === 'string' && name.trim().length > 0)
        .map(name => name.trim())
        .slice(0, 2); // Show only first 2 authors
      
      if (authorList.length === 0) {
        return "Unknown authors";
      }
      
      const formattedAuthors = authorList.join(", ");
      return formattedAuthors;
      
    } catch (error) {
      console.error("Error formatting authors:", error, "Authors data:", authors);
      return "Unknown authors";
    }
  };

  // Fetch PubMed Articles
  useEffect(() => {
    const fetchPubMed = async () => {
      try {
        const response = await axios.get(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=diabetes&retmode=json&retmax=15`
        );

        const articleIds = response.data.esearchresult.idlist;
        if (articleIds.length === 0) {
          setPubmedArticles([]);
          return;
        }

        const detailsResponse = await axios.get(
          `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${articleIds.join(",")}&retmode=json`
        );

        const articles = Object.values(detailsResponse.data.result).filter(
          (article) => article.uid
        );
        
        // Debug: Log the structure of first article to understand data format
        if (articles.length > 0) {
          console.log("Sample article structure:", articles[0]);
          console.log("Authors structure:", articles[0].authors);
        }
        
        setPubmedArticles(articles);
      } catch (err) {
        console.error("Error fetching PubMed articles:", err);
        setError("Failed to load PubMed articles.");
      }
    };

    fetchPubMed();
  }, []);

  // Fetch Clinical Trials
  useEffect(() => {
    const fetchClinicalTrials = async () => {
      try {
        const response = await axios.get(
          "https://clinicaltrials.gov/api/v2/studies?query.cond=diabetes&filter.overallStatus=RECRUITING&pageSize=10"
        );

        const trials = response.data.studies.map((trial) => ({
          id: trial.protocolSection.identificationModule.nctId,
          title:
            trial.protocolSection.identificationModule.briefTitle ||
            "No title available",
          sponsor:
            trial.protocolSection.sponsorCollaboratorsModule.leadSponsor.name ||
            "Unknown",
          startDate:
            trial.protocolSection.statusModule.startDateStruct?.date ||
            "Not provided",
          status: trial.protocolSection.statusModule.overallStatus || "Unknown",
          link: `https://clinicaltrials.gov/study/${trial.protocolSection.identificationModule.nctId}`,
        }));

        setClinicalTrials(trials);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching Clinical Trials:", err);
        setError("Failed to load clinical trials.");
        setLoading(false);
      }
    };

    fetchClinicalTrials();
  }, []);

  if (loading) {
    return (
      <div className="news-loading-container">
        <div className="news-loader">
          <div className="news-loader-spinner"></div>
          <p>Fetching latest news and clinical trials...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-error-container">
        <div className="news-error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="news-page-container">
      <div className="news-header">
        <h1>Latest News & Clinical Trials</h1>
        <p>Stay updated with the latest research and ongoing clinical trials in diabetes</p>
      </div>

      <div className="news-grid">
        {/* PubMed Articles Section */}
        <section className="news-section">
          <div className="news-section-header">
            <h2>Latest Research Articles</h2>
            <span className="news-section-icon">📄</span>
          </div>
          
          <div className="news-cards">
            {pubmedArticles.length > 0 ? (
              pubmedArticles.map((article, index) => (
                <article className="news-card" key={index}>
                  <div className="news-card-content">
                    <h3>
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {article.title}
                      </a>
                    </h3>
                    <div className="news-card-meta">
                      <span className="news-card-date">
                        <i className="news-card-icon">📅</i>
                        {article.pubdate || "Unknown"}
                      </span>
                      {article.authors && (
                        <span className="news-card-authors">
                          <i className="news-card-icon">👥</i>
                          {formatAuthors(article.authors)}
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="news-empty-state">
                <p>No articles found</p>
              </div>
            )}
          </div>
        </section>

        {/* Clinical Trials Section */}
        <section className="news-section">
          <div className="news-section-header">
            <h2>Ongoing Clinical Trials</h2>
            <span className="news-section-icon">🧪</span>
          </div>
          
          <div className="news-cards">
            {clinicalTrials.length > 0 ? (
              clinicalTrials.map((trial, index) => (
                <article className="news-card" key={index}>
                  <div className="news-card-content">
                    <h3>
                      <a
                        href={trial.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {trial.title}
                      </a>
                    </h3>
                    <div className="news-card-meta">
                      <span className="news-card-sponsor">
                        <i className="news-card-icon">🏥</i>
                        {trial.sponsor}
                      </span>
                      <span className="news-card-date">
                        <i className="news-card-icon">📅</i>
                        {trial.startDate}
                      </span>
                      <span className="news-card-status">
                        <i className="news-card-icon">🩺</i>
                        {trial.status}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="news-empty-state">
                <p>No active clinical trials found</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default News;

