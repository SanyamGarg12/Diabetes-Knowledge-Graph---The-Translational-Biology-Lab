import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

const News = () => {
  const [pubmedArticles, setPubmedArticles] = useState([]);
  const [clinicalTrials, setClinicalTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
                          {article.authors.slice(0, 2).join(", ")}
                          {article.authors.length > 2 ? " et al." : ""}
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

