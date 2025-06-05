import React from "react";
import "../styles.css";

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Understanding Diabetes</h1>
          <p className="hero-subtitle">
            Exploring the complex relationships between genes, proteins, and diseases through advanced knowledge graphs
          </p>
          <div className="hero-stats">
            <div className="stat-card">
              <span className="stat-number">500M+</span>
              <span className="stat-label">People Affected</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">101M+</span>
              <span className="stat-label">Cases in India</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">16+</span>
              <span className="stat-label">Data Sources</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="home-content">
        {/* Overview Section */}
        <section className="content-section">
          <div className="section-header">
            <h2>Type 2 Diabetes Overview</h2>
            <div className="section-divider"></div>
          </div>
          <div className="overview-card">
            <p>
              <b>Type 2 Diabetes</b> is a chronic condition that affects how your body processes blood sugar (glucose). It occurs when the body becomes resistant to insulin or when the pancreas fails to produce enough insulin to maintain normal glucose levels. Unlike Type 1 Diabetes, which is primarily genetic and autoimmune, Type 2 Diabetes is often linked to lifestyle factors such as diet, physical activity, and weight management.
            </p>
            <p>
              This condition is one of the most common health challenges worldwide, impacting millions of people. If left unmanaged, it can lead to serious complications such as heart disease, nerve damage, kidney problems, and vision loss. However, with the right lifestyle changes, medication, and monitoring, Type 2 Diabetes can be effectively controlled, allowing individuals to lead a healthy and active life.
            </p>
          </div>
        </section>

        {/* Why Us Section */}
        <section className="content-section">
          <div className="section-header">
            <h2>Why Choose Our Platform?</h2>
            <div className="section-divider"></div>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Comprehensive Knowledge Graph</h3>
              <p>Explore complex relationships between genes, proteins, diseases, and drugs through our advanced knowledge graph.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔬</div>
              <h3>Latest Research</h3>
              <p>Access information from research papers published between 2000 and 2025 on PubMed.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Data Integration</h3>
              <p>Integrated data from multiple high-quality biomedical databases for comprehensive insights.</p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="content-section">
          <div className="section-header">
            <h2>Epidemiology & Statistics</h2>
            <div className="section-divider"></div>
          </div>
          <div className="stats-container">
            <div className="stats-card">
              <h3>Global Impact</h3>
              <p>According to the International Diabetes Federation (IDF), over 500 million people worldwide live with diabetes, and the number is expected to rise significantly in the coming decades.</p>
            </div>
            <div className="stats-card">
              <h3>India's Challenge</h3>
              <p>India is often referred to as the "Diabetes Capital of the World", with over 101 million people living with diabetes as of 2023.</p>
            </div>
            <div className="stats-card">
              <h3>Key Statistics</h3>
              <ul className="stats-list">
                <li>11.4% of adults in India have diabetes</li>
                <li>15-20% prevalence in urban areas</li>
                <li>5-7% prevalence in rural regions</li>
                <li>Increasing cases among younger individuals</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Data Sources Section */}
        <section className="content-section">
          <div className="section-header">
            <h2>Data Sources</h2>
            <div className="section-divider"></div>
          </div>
          <div className="data-sources-grid">
            {[
              { name: "OMIM", url: "https://omim.org/" },
              { name: "NCBI", url: "https://www.ncbi.nlm.nih.gov/" },
              { name: "CTD", url: "https://ctdbase.org/" },
              { name: "TTD", url: "https://db.idrblab.net/ttd/" },
              { name: "HUGO", url: "https://www.genenames.org/" },
              { name: "miRTarBase", url: "https://mirtarbase.cuhk.edu.cn/" },
              { name: "T2Diacod", url: "https://t2diacod.igib.res.in/" },
              { name: "DisGeNET", url: "https://www.disgenet.org/" },
              { name: "Rhea", url: "https://www.rhea-db.org/" },
              { name: "KEGG", url: "https://www.kegg.jp/" },
              { name: "Gene Ontology", url: "http://geneontology.org/" },
              { name: "AlphaFold", url: "https://alphafold.ebi.ac.uk/" },
              { name: "UniProt", url: "https://www.uniprot.org/" },
              { name: "InterPro", url: "https://www.ebi.ac.uk/interpro/" },
              { name: "PROSITE", url: "https://prosite.expasy.org/" },
              { name: "DbKB", url: "https://www.sciencedirect.com/science/article/pii/S2352340923010338" }
            ].map((source, index) => (
              <a
                key={index}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="source-card"
              >
                {source.name}
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;


