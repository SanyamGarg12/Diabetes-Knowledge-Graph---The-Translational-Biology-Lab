// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles.css";

// const News = () => {
//   const [pubmedArticles, setPubmedArticles] = useState([]);
//   const [clinicalTrials, setClinicalTrials] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     setTimeout(() => {
//       setLoading(false);
//     }, 3000);
//   }, []);

//   // Fetch PubMed Articles
//   useEffect(() => {
//     const fetchPubMed = async () => {
//       try {
//         const response = await axios.get(
//           `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=diabetes&retmode=json&retmax=5`
//         );

//         const articleIds = response.data.esearchresult.idlist;
//         if (articleIds.length === 0) {
//           setPubmedArticles([]);
//           return;
//         }

//         const detailsResponse = await axios.get(
//           `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${articleIds.join(",")}&retmode=json`
//         );

//         const articles = Object.values(detailsResponse.data.result).filter(
//           (article) => article.uid
//         );
//         setPubmedArticles(articles);
//       } catch (err) {
//         console.error("Error fetching PubMed articles:", err);
//         setError("Failed to load PubMed articles.");
//       }
//     };

//     fetchPubMed();
//   }, []);

//   // Fetch Clinical Trials
//   useEffect(() => {
//     const fetchClinicalTrials = async () => {
//       try {
//         const response = await axios.get(
//           "https://clinicaltrials.gov/api/v2/studies?query.cond=diabetes&filter.overallStatus=RECRUITING&pageSize=5"
//         );

//         const trials = response.data.studies.map((trial) => ({
//           id: trial.protocolSection.identificationModule.nctId,
//           title:
//             trial.protocolSection.identificationModule.briefTitle ||
//             "No title available",
//           sponsor:
//             trial.protocolSection.sponsorCollaboratorsModule.leadSponsor.name ||
//             "Unknown",
//           startDate:
//             trial.protocolSection.statusModule.startDateStruct?.date ||
//             "Not provided",
//           status: trial.protocolSection.statusModule.overallStatus || "Unknown",
//           link: `https://clinicaltrials.gov/study/${trial.protocolSection.identificationModule.nctId}`,
//           summary:
//             trial.protocolSection.descriptionModule?.briefSummary ||
//             "No summary available.",
//         }));

//         setClinicalTrials(trials);
//       } catch (err) {
//         console.error("Error fetching Clinical Trials:", err);
//         setError("Failed to load clinical trials.");
//       }
//     };

//     fetchClinicalTrials();
//   }, []);

//   return (
//     <div className="news-container">
//       <h1 className="news-heading">📰 Latest News Related to Diabetes</h1>

//       {loading ? (
//         <div className="loader-container">
//           <div className="loader"></div>
//         </div>
//       ) : (
//         <>
//           {/* PubMed Articles */}
//           <div className="news-section">
//             <h2>📄 Latest PubMed Articles</h2>
//             {pubmedArticles.length > 0 ? (
//               <ul>
//                 {pubmedArticles.map((article, index) => (
//                   <li className="pubmed_li" key={index}>
//                     <a
//                       href={`https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       {article.title}
//                     </a>
//                     <p>📅 Published: {article.pubdate || "Unknown"}</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No articles found.</p>
//             )}
//           </div>

//           {/* Clinical Trials Section */}
//           <div className="news-section">
//             <h2>🧪 Ongoing Clinical Trials</h2>
//             {clinicalTrials.length > 0 ? (
//               <ul>
//                 {clinicalTrials.map((trial, index) => (
//                   <li className="pubmed_li" key={index}>
//                     <a href={trial.link} target="_blank" rel="noopener noreferrer">
//                       {trial.title}
//                     </a>
//                     <p>🏥 Sponsor: {trial.sponsor}</p>
//                     <p>📅 Start Date: {trial.startDate}</p>
//                     <p>🩺 Status: {trial.status}</p>
//                     <p>📜 Summary: {trial.summary}</p>
//                   </li>
//                 ))}
//               </ul>
//             ) : (
//               <p>No active clinical trials found.</p>
//             )}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default News;


import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles.css";

const News = () => {
  const [pubmedArticles, setPubmedArticles] = useState([]);
  const [clinicalTrials, setClinicalTrials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

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
      } catch (err) {
        console.error("Error fetching Clinical Trials:", err);
        setError("Failed to load clinical trials.");
      }
    };

    fetchClinicalTrials();
  }, []);

  return (
    <div className="news-container">
      <h1 className="news-heading">📰 Latest News Related to Diabetes</h1>

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <>
          {/* News Sections Display Side by Side */}
          <div className="news-sections">
            {/* PubMed Articles */}
            <div className="news-section">
              <h2>📄 Latest PubMed Articles</h2>
              {pubmedArticles.length > 0 ? (
                <div className="news-items">
                  {pubmedArticles.map((article, index) => (
                    <div className="news-item" key={index}>
                      <a
                        href={`https://pubmed.ncbi.nlm.nih.gov/${article.uid}/`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {article.title}
                      </a>
                      <p className="published-date">
                        📅 Published: {article.pubdate || "Unknown"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No articles found.</p>
              )}
            </div>

            {/* Clinical Trials Section */}
            <div className="news-section">
              <h2>🧪 Ongoing Clinical Trials</h2>
              {clinicalTrials.length > 0 ? (
                <div className="news-items">
                  {clinicalTrials.map((trial, index) => (
                    <div className="news-item" key={index}>
                      <a
                        href={trial.link}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {trial.title}
                      </a>
                      <p>🏥 Sponsor: {trial.sponsor}</p>
                      <p>📅 Start Date: {trial.startDate}</p>
                      <p>🩺 Status: {trial.status}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No active clinical trials found.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default News;

