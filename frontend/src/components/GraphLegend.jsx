import React, { useState } from "react";
import { LABEL_COLOR_MAPPING, getContrastingTextColor } from "../utils/colorMapping";

export default function GraphLegend() {
  const [isExpanded, setIsExpanded] = useState(false);

  // Group labels by category for better organization
  const labelCategories = {
    'Genes & Proteins': [
      'Gene_Symbol', 'Gene', 'Protein', 'Protein_Coding'
    ],
    'Diseases & Conditions': [
      'Disease', 'Disorder', 'Syndrome', 'Condition'
    ],
    'Chemicals & Drugs': [
      'Chemical_Name', 'Drug', 'Compound', 'Chemical'
    ],
    'RNA Types': [
      'miRNA', 'microRNA', 'lncRNA', 'ncRNA', 'RNA'
    ],
    'Transcription Factors': [
      'Transcription_Factor', 'TF', 'TF_Gene'
    ],
    'Pathways & Functions': [
      'Pathway', 'Process', 'Function'
    ],
    'Cell Types & Tissues': [
      'Cell_Type', 'Tissue', 'Organ'
    ],
    'Genetic Variants': [
      'Mutation', 'Variant', 'SNP'
    ],
    'Interactions': [
      'Interaction', 'Relationship', 'Association'
    ],
    'Enzymes & Catalysts': [
      'Enzyme', 'Catalyst'
    ],
    'Receptors & Channels': [
      'Receptor', 'Channel'
    ],
    'Hormones & Signaling': [
      'Hormone', 'Signaling'
    ],
    'Metabolites & Biomarkers': [
      'Metabolite', 'Biomarker'
    ]
  };

  return (
    <div className="graph-legend">
      <button 
        className="legend-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {isExpanded ? '▼' : '▶'} Color Legend
      </button>
      
      {isExpanded && (
        <div className="legend-content">
          {Object.entries(labelCategories).map(([category, labels]) => (
            <div key={category} className="legend-category">
              <h4 className="category-title">{category}</h4>
              <div className="legend-items">
                {labels.map(label => {
                  const color = LABEL_COLOR_MAPPING[label];
                  const textColor = getContrastingTextColor(color);
                  
                  return (
                    <div key={label} className="legend-item">
                      <div 
                        className="legend-color"
                        style={{ 
                          backgroundColor: color,
                          color: textColor
                        }}
                      >
                        ●
                      </div>
                      <span className="legend-label">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
