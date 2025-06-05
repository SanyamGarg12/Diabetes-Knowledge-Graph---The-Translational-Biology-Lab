import React from "react";
import "../styles.css";

const Statistics = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Knowledge Graph Statistics
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Comprehensive overview of nodes, relationships, and property keys in our diabetes knowledge graph
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-[1.02]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="text-blue-600 mr-2">📊</span>
              Node Statistics
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Node Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Gene_Symbol</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">19,634</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">GO_Biological_Process_ID</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">6,812</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Chemical_Name</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">3,654</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">miRNA</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2,545</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Drug_Name</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,943</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">GO_Molecular_Function_ID</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,775</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Protein</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,412</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Reaction</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,145</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">GO_Cellular_Component_ID</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">791</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Kegg</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">336</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">lncRNA</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">185</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Disease</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transform transition-all duration-300 hover:scale-[1.02]">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
              <span className="text-blue-600 mr-2">🔗</span>
              Relationship Statistics
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Relationship Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">HAS_TARGET</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2,867,931</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">INTERACTS_WITH</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">51,724</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">INFLUENCED_BY</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">37,236</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PARTICIPATES_IN_Biological_Process</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">31,546</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PARTICIPATES_IN_Molecular_Function</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">11,284</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">PARTICIPATES_IN_Cellular_Component</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">10,219</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">INVOLVED_IN_PATHWAY</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">5,813</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Biotype</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2,461</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">HAS_DRUG_TARGET</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2,168</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">CATALYZES</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,636</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">ENCODES_PROTEIN</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">1,412</td></tr>
                  <tr><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">HAS_DISEASE_lncRNA_ASSOCIATION</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">297</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="text-blue-600 mr-2">📝</span>
            Knowledge Graph Overview
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              Our knowledge graph contains a diverse set of property keys that enrich the representation 
              of biological and chemical entities. These properties span various domains, including genomic, 
              proteomic, chemical, and pathway-related information. For instance, <span className="font-semibold text-blue-600">AlphaFoldDB</span>, <span className="font-semibold text-blue-600">PDB</span> and <span className="font-semibold text-blue-600">PDBsum</span> provide
              structural insights into proteins, while <span className="font-semibold text-blue-600">EC_number</span>, <span className="font-semibold text-blue-600">Enzyme</span>, and <span className="font-semibold text-blue-600">Rhea_ID</span> capture 
              enzymatic functions and biochemical reactions.
            </p>
            <p className="mb-4">
              The graph also integrates genetic identifiers such as <span className="font-semibold text-blue-600">ensembl_id</span>, <span className="font-semibold text-blue-600">entrez_id</span>, and <span className="font-semibold text-blue-600">hgnc</span>, 
              enabling seamless cross-referencing with genomic databases. Furthermore, <span className="font-semibold text-blue-600">chromosomal_location</span>, 
              <span className="font-semibold text-blue-600">dbSNP</span>, and <span className="font-semibold text-blue-600">omim_id</span> offer insights into genetic variations and disease associations.
            </p>
          </div>
        </div>

        {/* Property Keys Table */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="text-blue-600 mr-2">🔑</span>
            Property Keys in the Knowledge Graph
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Property Keys</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Protein and Enzyme Properties</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-flex flex-wrap gap-2">
                      {['AlphaFoldDB', 'Entry', 'Enzyme', 'EC_number', 'ProteinNames', 'Pfam', 'PROSITE', 'InterPro', 'PDB', 'PDBsum', 'alphafolddb', 'Length', 'Rhea_ID'].map((key) => (
                        <span key={key} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs">{key}</span>
                      ))}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Genomic Properties</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-flex flex-wrap gap-2">
                      {['Chromosomal_Location', 'ensembl', 'ensembl_id', 'entrez_id', 'hgnc', 'omim_id', 'dbSNP'].map((key) => (
                        <span key={key} className="px-2 py-1 bg-green-50 text-green-700 rounded-md text-xs">{key}</span>
                      ))}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Functional Annotations</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-flex flex-wrap gap-2">
                      {['GO_Biological_Process_TERM', 'GO_Cellular_Component_TERM', 'GO_Molecular_Function_TERM'].map((key) => (
                        <span key={key} className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs">{key}</span>
                      ))}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Chemical and Clinical Properties</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-flex flex-wrap gap-2">
                      {['chemical_id', 'MeSH_ID', 'clinical_status'].map((key) => (
                        <span key={key} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded-md text-xs">{key}</span>
                      ))}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Pathway and Interaction Properties</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-flex flex-wrap gap-2">
                      {['pathway_name', 'interaction', 'interaction_actions', 'causal_description', 'is_transcriptional_factor'].map((key) => (
                        <span key={key} className="px-2 py-1 bg-red-50 text-red-700 rounded-md text-xs">{key}</span>
                      ))}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Identifiers and Aliases</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <span className="inline-flex flex-wrap gap-2">
                      {['alias', 'name', 'pubmed_ids'].map((key) => (
                        <span key={key} className="px-2 py-1 bg-gray-50 text-gray-700 rounded-md text-xs">{key}</span>
                      ))}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-6 text-sm text-gray-600">
            The listed property keys represent various attributes in the knowledge graph, covering proteins, genes, chemicals, pathways, interactions, and clinical data. These properties enhance data integration, allowing efficient exploration of biological relationships, disease associations, and functional annotations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Statistics;

