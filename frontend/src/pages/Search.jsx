import React, { useState, useEffect } from "react";
import { useApp } from "../store";
import { search, getFacets, getNeighbors } from "../api";
import SearchBar from "../components/SearchBar";
import FacetPanel from "../components/FacetPanel";
import GraphView from "../components/GraphView";
import TableView from "../components/TableView";
import "../styles.css";

const Search = () => {
  const { q, label, field, hits, setHits, seed, setSeed, selectedLabels, selectedRelTypes, mergeGraph, setQuery, setLabel, setField } = useApp();
  const [facets, setFacets] = useState([]);
  const [loading, setLoading] = useState(false);

  async function doSearch() {
    setLoading(true);
    try {
      const data = await search(q, label, field);
      setHits(data.results || []);
    } finally {
      setLoading(false);
    }
  }

  async function loadSeed(hit) {
    setSeed(hit);
    const fac = await getFacets(hit.id);
    setFacets(fac.rows || []);
    // Auto-expand once to mirror reference UX
    const neighborLabels = selectedLabels.join(",");
    const relTypes = selectedRelTypes.join(",");
    const payload = { neighborLabels, relTypes, limit: 300, exclude: [...useApp.getState().excludeIds].join(",") };
    const data = await getNeighbors(hit.id, payload);
    mergeGraph(data.nodes || [], data.edges || []);
  }

  async function expandOnce() {
    if (!seed) return;
    const neighborLabels = selectedLabels.join(",");
    const relTypes = selectedRelTypes.join(",");
    const payload = { neighborLabels, relTypes, limit: 300, exclude: [...useApp.getState().excludeIds].join(",") };
    const data = await getNeighbors(seed.id, payload);
    mergeGraph(data.nodes || [], data.edges || []);
  }

  // If there are results but no selection yet, auto-load the first result
  useEffect(() => {
    if (hits && hits.length > 0 && !seed) {
      // Load first result as seed to immediately show graph & table
      loadSeed(hits[0]);
    }
  }, [hits]);

  const quickExamples = [
    { label: 'Disease', field: 'name', q: 'diabetes' },
    { label: 'Gene_Symbol', field: 'name', q: 'TP53' },
    { label: 'Chemical_Name', field: 'name', q: 'Metformin' },
  ];

  function applyExample(ex) {
    setLabel(ex.label);
    setField(ex.field);
    setQuery(ex.q);
  }

  return (
    <div className="layout">
      <div className="search-toolbar">
        <SearchBar onSearch={doSearch} loading={loading} />
      </div>
      <div className="content">
        <aside className="left">
          <h3 className="left-title">Results <span className="count-badge">{hits.length}</span></h3>
          <ul className="results">
            {hits.map((h) => (
              <li key={h.id} onClick={() => loadSeed(h)} className={seed && h.id === seed.id ? 'selected' : ''}>
                <span className="badge">{(h.labels && h.labels[0]) || "Node"}</span> {(h.name || (h.props && h.props.name)) || "(no name)"} {h.is_tf ? <em> (TF)</em> : null}
                <div className="aliases">{((h.aliases || [])).join(", ")}</div>
              </li>
            ))}
          </ul>
          {hits.length === 0 && (
            <div className="no-results">No results yet. Try one of these examples:</div>
          )}
          {hits.length === 0 && (
            <div className="example-chips">
              {quickExamples.map((ex) => (
                <button key={ex.q} className="chip large" onClick={() => applyExample(ex)}>
                  {ex.label}: {ex.q}
                </button>
              ))}
            </div>
          )}
          {seed && <FacetPanel seedId={seed.id} facets={facets} />}
          {seed && (
            <div style={{ marginTop: 8 }}>
              <button className="expand-btn" onClick={expandOnce}>Expand</button>
            </div>
          )}
        </aside>

        <main className="right">
          {(hits.length === 0 && !seed) ? (
            <div className="empty-state">
              <h3>How to search</h3>
              <ol>
                <li>Select a label (e.g., Disease, Gene_Symbol) and a field (e.g., name).</li>
                <li>Type your query term (e.g., diabetes, TP53) and click Search.</li>
                <li>Click a result to load facets and the graph, then use Expand to explore neighbors.</li>
              </ol>
              <p className="tip">Tip: Narrow results quickly by combining label + field + a specific term.</p>
            </div>
          ) : (
            <div className="split">
              <div className="pane">
                <GraphView />
              </div>
              <div className="pane">
                <TableView />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;

