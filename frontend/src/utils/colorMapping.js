// Color mapping for different node labels
// All colors are carefully selected to be easily distinguishable
export const LABEL_COLOR_MAPPING = {
  // Genes and Proteins
  'Gene_Symbol': '#FF6B6B',        // Red - Primary genes
  'Gene': '#FF6B6B',               // Red - Generic genes
  'Protein': '#4ECDC4',            // Teal - Proteins
  'Protein_Coding': '#4ECDC4',     // Teal - Protein coding genes
  
  // Diseases and Conditions
  'Disease': '#FFE66D',            // Yellow - Diseases
  'Disorder': '#FFE66D',           // Yellow - Disorders
  'Syndrome': '#FFE66D',           // Yellow - Syndromes
  'Condition': '#FFE66D',          // Yellow - Medical conditions
  
  // Chemicals and Drugs
  'Chemical_Name': '#95E1D3',      // Light green - Chemicals
  'Drug': '#95E1D3',               // Light green - Drugs
  'Compound': '#95E1D3',           // Light green - Compounds
  'Chemical': '#95E1D3',           // Light green - Chemical entities
  
  // MicroRNAs and Non-coding RNAs
  'miRNA': '#A8E6CF',              // Green - MicroRNAs
  'microRNA': '#A8E6CF',           // Green - MicroRNAs
  'lncRNA': '#FFB6C1',             // Light pink - Long non-coding RNAs
  'ncRNA': '#FFB6C1',              // Light pink - Non-coding RNAs
  'RNA': '#FFB6C1',                // Light pink - RNA entities
  
  // Transcription Factors
  'Transcription_Factor': '#DDA0DD', // Plum - Transcription factors
  'TF': '#DDA0DD',                 // Plum - TFs
  'TF_Gene': '#DDA0DD',            // Plum - TF genes
  
  // Pathways and Processes
  'Pathway': '#87CEEB',            // Sky blue - Biological pathways
  'Process': '#87CEEB',            // Sky blue - Biological processes
  'Function': '#87CEEB',           // Sky blue - Molecular functions
  
  // Cell Types and Tissues
  'Cell_Type': '#F0E68C',          // Khaki - Cell types
  'Tissue': '#F0E68C',             // Khaki - Tissues
  'Organ': '#F0E68C',              // Khaki - Organs
  
  // Mutations and Variants
  'Mutation': '#FFA07A',           // Light salmon - Mutations
  'Variant': '#FFA07A',            // Light salmon - Genetic variants
  'SNP': '#FFA07A',                // Light salmon - Single nucleotide polymorphisms
  
  // Interactions and Relationships
  'Interaction': '#D8BFD8',        // Thistle - Interactions
  'Relationship': '#D8BFD8',       // Thistle - Relationships
  'Association': '#D8BFD8',        // Thistle - Associations
  
  // Enzymes and Catalysts
  'Enzyme': '#20B2AA',             // Light sea green - Enzymes
  'Catalyst': '#20B2AA',           // Light sea green - Catalysts
  
  // Receptors and Channels
  'Receptor': '#DEB887',           // Burlywood - Receptors
  'Channel': '#DEB887',            // Burlywood - Ion channels
  
  // Hormones and Signaling
  'Hormone': '#F5DEB3',            // Wheat - Hormones
  'Signaling': '#F5DEB3',          // Wheat - Signaling molecules
  
  // Metabolites and Biomarkers
  'Metabolite': '#98FB98',         // Pale green - Metabolites
  'Biomarker': '#98FB98',          // Pale green - Biomarkers
  
  // Default fallback
  'default': '#3498DB',            // Blue - Default color
};

// Function to get color for a label
export function getColorForLabel(label) {
  if (!label) return LABEL_COLOR_MAPPING.default;
  
  // Handle arrays of labels (take the first one)
  if (Array.isArray(label)) {
    label = label[0];
  }
  
  // Direct mapping
  if (LABEL_COLOR_MAPPING[label]) {
    return LABEL_COLOR_MAPPING[label];
  }
  
  // Try case-insensitive matching
  const lowerLabel = label.toLowerCase();
  for (const [key, color] of Object.entries(LABEL_COLOR_MAPPING)) {
    if (key.toLowerCase() === lowerLabel) {
      return color;
    }
  }
  
  // Try partial matching for compound labels
  for (const [key, color] of Object.entries(LABEL_COLOR_MAPPING)) {
    if (lowerLabel.includes(key.toLowerCase()) || key.toLowerCase().includes(lowerLabel)) {
      return color;
    }
  }
  
  // Fallback to default
  return LABEL_COLOR_MAPPING.default;
}

// Function to get a contrasting text color (black or white) for any background color
export function getContrastingTextColor(hexColor) {
  // Remove # if present
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Return black for light colors, white for dark colors
  return luminance > 0.5 ? '#000000' : '#FFFFFF';
}

// Export all available colors for reference
export const AVAILABLE_COLORS = Object.values(LABEL_COLOR_MAPPING);
