// import React from "react";
// import "../styles.css";

// const Statistics = () => {
//   // Node Type Data
//   const nodeData = [
//     { type: "Gene_Symbol", count: 19634 },
//     { type: "GO_Biological_Process_ID", count: 6812 },
//     { type: "Chemical_Name", count: 3654 },
//     { type: "miRNA", count: 2545 },
//     { type: "Drug_Name", count: 1943 },
//     { type: "GO_Molecular_Function_ID", count: 1775 },
//     { type: "Protein", count: 1412 },
//     { type: "Reaction", count: 1145 },
//     { type: "GO_Cellular_Component_ID", count: 791 },
//     { type: "Kegg", count: 336 },
//     { type: "lncRNA", count: 185 },
//     { type: "Disease", count: 10 },
//   ];

//   // Relationship Type Data
//   const relationshipData = [
//     { type: "HAS_TARGET", count: 2867931 },
//     { type: "INTERACTS_WITH", count: 51724 },
//     { type: "INFLUENCED_BY", count: 37236 },
//     { type: "PARTICIPATES_IN_Biological_Process", count: 31546 },
//     { type: "PARTICIPATES_IN_Molecular_Function", count: 11284 },
//     { type: "PARTICIPATES_IN_Cellular_Component", count: 10219 },
//     { type: "INVOLVED_IN_PATHWAY", count: 5813 },
//     { type: "Biotype", count: 2461 },
//     { type: "HAS_DRUG_TARGET", count: 2168 },
//     { type: "CATALYZES", count: 1636 },
//     { type: "ENCODES_PROTEIN", count: 1412 },
//     { type: "HAS_DISEASE_lncRNA_ASSOCIATION", count: 297 },
//   ];

//   return (
//     <div className="statistics-container">
//       <h2>Knowledge Graph Statistics</h2>
//       <div className="tables-container">
//         {/* Node Type Table */}
//         <div className="table-wrapper">
//           <h3>Node Type Counts</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Node Type</th>
//                 <th>Count</th>
//               </tr>
//             </thead>
//             <tbody>
//               {nodeData.map((node, index) => (
//                 <tr key={index}>
//                   <td>{node.type}</td>
//                   <td>{node.count.toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Relationship Type Table */}
//         <div className="table-wrapper">
//           <h3>Relationship Type Counts</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Relationship Type</th>
//                 <th>Count</th>
//               </tr>
//             </thead>
//             <tbody>
//               {relationshipData.map((rel, index) => (
//                 <tr key={index}>
//                   <td>{rel.type}</td>
//                   <td>{rel.count.toLocaleString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Description Below the Tables */}
//       <div className="statistics-description">
//         <p>
//           Our knowledge graph contains a diverse set of property keys that enrich the representation 
//           of biological and chemical entities. These properties span various domains, including genomic, 
//           proteomic, chemical, and pathway-related information. For instance, <b>AlphaFoldDB, PDB</b> and <b>PDBsum</b> provide
//            structural insights into proteins, while <b>EC_number, Enzyme,</b> and <b>Rhea_ID</b> capture 
//            enzymatic functions and biochemical reactions. 
//           <b>GO_Biological_Process_TERM, GO_Cellular_Component_TERM,</b> and <b>GO_Molecular_Function_TERM</b> map
//            functional annotations from Gene Ontology.
//         </p>
//         <p>
//           The graph also integrates genetic identifiers such as <b>ensembl_id, entrez_id,</b> and <b>hgnc,</b> 
//           enabling seamless cross-referencing with genomic databases. Furthermore, <b>chromosomal_location, 
//           dbSNP,</b> and <b>omim_id</b> offer insights into genetic variations and disease associations. 
//           Chemical entities are well-defined through <b>chemical_id, MeSH_ID,</b> and <b>clinical_status,</b> 
//           allowing for connections between biomolecules and medical classifications.
//         </p>
//         <p>
//           Additionally, <b>alias, name, protein_names,</b> and interaction properties enhance entity descriptions 
//           and their functional relationships. This structured data facilitates complex queries, enabling users 
//           to explore interactions, functional annotations, and disease linkages efficiently.
//         </p>
//       </div>
//     </div>

    
//   );
// };

// export default Statistics;



import React from "react";
import "../styles.css";

const Statistics = () => {
  return (
    <div className="statistics-container">
      <h1 className="page-title">Knowledge Graph Statistics</h1>

      {/* Tables Section */}
      <div className="tables-section">
        {/* Node Count Table */}
        <div className="table-wrapper">
          <h2 className="section-title">Node Statistics</h2>
          <table className="statistics-table">
            <thead>
              <tr>
                <th>Node Type</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>Gene_Symbol</td><td>19,634</td></tr>
              <tr><td>GO_Biological_Process_ID</td><td>6,812</td></tr>
              <tr><td>Chemical_Name</td><td>3,654</td></tr>
              <tr><td>miRNA</td><td>2,545</td></tr>
              <tr><td>Drug_Name</td><td>1,943</td></tr>
              <tr><td>GO_Molecular_Function_ID</td><td>1,775</td></tr>
              <tr><td>Protein</td><td>1,412</td></tr>
              <tr><td>Reaction</td><td>1,145</td></tr>
              <tr><td>GO_Cellular_Component_ID</td><td>791</td></tr>
              <tr><td>Kegg</td><td>336</td></tr>
              <tr><td>lncRNA</td><td>185</td></tr>
              <tr><td>Disease</td><td>10</td></tr>
            </tbody>
          </table>
        </div>

        {/* Relationship Count Table */}
        <div className="table-wrapper">
          <h2 className="section-title">Relationship Statistics</h2>
          <table className="statistics-table">
            <thead>
              <tr>
                <th>Relationship Type</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>HAS_TARGET</td><td>2,867,931</td></tr>
              <tr><td>INTERACTS_WITH</td><td>51,724</td></tr>
              <tr><td>INFLUENCED_BY</td><td>37,236</td></tr>
              <tr><td>PARTICIPATES_IN_Biological_Process</td><td>31,546</td></tr>
              <tr><td>PARTICIPATES_IN_Molecular_Function</td><td>11,284</td></tr>
              <tr><td>PARTICIPATES_IN_Cellular_Component</td><td>10,219</td></tr>
              <tr><td>INVOLVED_IN_PATHWAY</td><td>5,813</td></tr>
              <tr><td>Biotype</td><td>2,461</td></tr>
              <tr><td>HAS_DRUG_TARGET</td><td>2,168</td></tr>
              <tr><td>CATALYZES</td><td>1,636</td></tr>
              <tr><td>ENCODES_PROTEIN</td><td>1,412</td></tr>
              <tr><td>HAS_DISEASE_lncRNA_ASSOCIATION</td><td>297</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Knowledge Graph Description */}
      <p className="statistics-description">
        The knowledge graph contains a diverse set of property keys that enrich the representation of biological and chemical entities. 
        These properties span various domains, including genomic, proteomic, chemical, and pathway-related information. 
        For instance, AlphaFoldDB, PDB, and PDBsum provide structural insights into proteins, while EC_number, Enzyme, 
        and Rhea_ID capture enzymatic functions and biochemical reactions. GO_Biological_Process_TERM, 
        GO_Cellular_Component_TERM, and GO_Molecular_Function_TERM map functional annotations from Gene Ontology. 
        The graph also integrates genetic identifiers such as ensembl_id, entrez_id, and hgnc, enabling seamless 
        cross-referencing with genomic databases. Furthermore, chromosomal_location, dbSNP, and omim_id offer insights 
        into genetic variations and disease associations. Chemical entities are well-defined through chemical_id, 
        MeSH_ID, and clinical_status, allowing for connections between biomolecules and medical classifications. 
        Additionally, alias, name, protein_names, and interaction properties enhance entity descriptions and their functional relationships. 
        This structured data facilitates complex queries, enabling users to explore interactions, functional annotations, and disease linkages efficiently.
      </p>

      {/* Property Keys Table */}
      <h2 className="section-title">Property Keys in the Knowledge Graph</h2>
      <div className="table-container">
        <table className="statistics-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Property Keys</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Protein and Enzyme Properties</td>
              <td>AlphaFoldDB, Entry, Enzyme, EC_number, ProteinNames, Pfam, PROSITE, InterPro, PDB, PDBsum, alphafolddb, Length, Rhea_ID</td>
            </tr>
            <tr>
              <td>Genomic Properties</td>
              <td>Chromosomal_Location, ensembl, ensembl_id, entrez_id, hgnc, omim_id, dbSNP</td>
            </tr>
            <tr>
              <td>Functional Annotations (Gene Ontology)</td>
              <td>GO_Biological_Process_TERM, GO_Cellular_Component_TERM, GO_Molecular_Function_TERM</td>
            </tr>
            <tr>
              <td>Chemical and Clinical Properties</td>
              <td>chemical_id, MeSH_ID, clinical_status</td>
            </tr>
            <tr>
              <td>Pathway and Interaction Properties</td>
              <td>pathway_name, interaction, interaction_actions, causal_description, is_transcriptional_factor</td>
            </tr>
            <tr>
              <td>Identifiers and Aliases</td>
              <td>alias, name, pubmed_ids</td>
            </tr>
          </tbody>
        </table>
        <p>The listed property keys represent various attributes in the knowledge graph, covering proteins, genes, chemicals, pathways, interactions, and clinical data. These properties enhance data integration, allowing efficient exploration of biological relationships, disease associations, and functional annotations.</p>
      </div>
    </div>
  );
};

export default Statistics;

