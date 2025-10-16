import React, { useMemo, useState } from "react";
import { useApp } from "../store";
import JSZip from "jszip";

export default function TableView() {
	const { nodes, edges } = useApp();
	const [tab, setTab] = useState("nodes");

	const nodeRows = useMemo(() => [...nodes.values()].slice(0, 1000), [nodes]);
	const edgeRows = useMemo(() => edges.slice(0, 2000), [edges]);

	const nameById = useMemo(() => {
		const m = new Map();
		for (const n of nodeRows) {
			const nm = n.name || (n.props && n.props.name) || String(n.id);
			m.set(String(n.id), nm);
		}
		return m;
	}, [nodeRows]);


	async function downloadNodesCsv() {
		const zip = new JSZip();
		const allNodes = [...nodes.values()];
		
		// Group nodes by their primary label
		const nodesByLabel = {};
		
		allNodes.forEach((n) => {
			const label = Array.isArray(n.labels) && n.labels[0] ? n.labels[0] : (n.label || "Unknown");
			if (!nodesByLabel[label]) {
				nodesByLabel[label] = [];
			}
			nodesByLabel[label].push(n);
		});

		// Create CSV for each label category
		for (const [label, labelNodes] of Object.entries(nodesByLabel)) {
			const rows = labelNodes.map((n) => {
				const props = n.props || {};
				return {
			id: n.id,
					name: n.name || props.name || "",
			labels: Array.isArray(n.labels) ? n.labels.join("|") : (n.label || ""),
					// Extract common useful properties
					entrez_id: props.entrez_id || "",
					hgnc: props.hgnc || "",
					alias: props.alias || "",
					chromosomal_location: props.Chromosomal_Location || props.chromosomal_location || "",
					interaction_actions: props.interaction_actions || "",
					// Add other useful props as separate columns
					uniprot_id: props.uniprot_id || props.UniProt || "",
					pubmed_id: props.pubmed_id || props.PubMed || "",
					mesh_id: props.mesh_id || props.MeSH || "",
					omim_id: props.omim_id || props.OMIM || "",
					// Keep a cleaned version of other props for reference
					other_props: Object.keys(props)
						.filter(key => !['name', 'entrez_id', 'hgnc', 'alias', 'Chromosomal_Location', 'chromosomal_location', 
							'interaction_actions', 'uniprot_id', 'UniProt', 'pubmed_id', 'PubMed', 'mesh_id', 'MeSH', 'omim_id', 'OMIM'].includes(key))
						.map(key => `${key}: ${props[key]}`)
						.join("; ")
				};
			});
			
			// Generate CSV content for this label
			const csvContent = generateCsvContent(rows);
			const fileName = `${label.replace(/[^a-zA-Z0-9]/g, '_')}_nodes.csv`;
			zip.file(fileName, csvContent);
		}

		// Add a summary file
		const summaryData = Object.entries(nodesByLabel).map(([label, labelNodes]) => ({
			label,
			count: labelNodes.length,
			description: getLabelDescription(label)
		}));
		const summaryCsv = generateCsvContent(summaryData);
		zip.file("summary.csv", summaryCsv);

		// Generate and download ZIP file
		try {
			const zipBlob = await zip.generateAsync({ type: "blob" });
			const link = document.createElement("a");
			link.href = URL.createObjectURL(zipBlob);
			link.setAttribute("download", "nodes_by_label.zip");
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Error creating ZIP file:", error);
			// Fallback to single CSV
			const fallbackRows = allNodes.map((n) => {
				const props = n.props || {};
				return {
					id: n.id,
					name: n.name || props.name || "",
					labels: Array.isArray(n.labels) ? n.labels.join("|") : (n.label || ""),
					entrez_id: props.entrez_id || "",
					hgnc: props.hgnc || "",
					alias: props.alias || "",
					chromosomal_location: props.Chromosomal_Location || props.chromosomal_location || "",
					interaction_actions: props.interaction_actions || "",
					uniprot_id: props.uniprot_id || props.UniProt || "",
					pubmed_id: props.pubmed_id || props.PubMed || "",
					mesh_id: props.mesh_id || props.MeSH || "",
					omim_id: props.omim_id || props.OMIM || "",
					other_props: Object.keys(props)
						.filter(key => !['name', 'entrez_id', 'hgnc', 'alias', 'Chromosomal_Location', 'chromosomal_location', 
							'interaction_actions', 'uniprot_id', 'UniProt', 'pubmed_id', 'PubMed', 'mesh_id', 'MeSH', 'omim_id', 'OMIM'].includes(key))
						.map(key => `${key}: ${props[key]}`)
						.join("; ")
				};
			});
			downloadCsv(fallbackRows, "nodes.csv");
		}
	}

	async function downloadEdgesCsv() {
		const zip = new JSZip();
		const nameById = new Map();
		for (const n of [...nodes.values()]) {
			const name = n.name || (n.props && n.props.name) || String(n.id);
			nameById.set(String(n.id), name);
		}

		// Group edges by relationship type
		const edgesByType = {};
		
		edges.forEach((e) => {
			const relType = e.type || "Unknown";
			if (!edgesByType[relType]) {
				edgesByType[relType] = [];
			}
			edgesByType[relType].push(e);
		});

		// Create CSV for each relationship type
		for (const [relType, typeEdges] of Object.entries(edgesByType)) {
			const rows = typeEdges.map((e) => {
				const props = e.props || {};
				return {
					source_id: e.src,
					target_id: e.dst,
					source_name: nameById.get(String(e.src)) || e.src,
					target_name: nameById.get(String(e.dst)) || e.dst,
					relationship_type: e.type,
					interaction_actions: Array.isArray(props.interaction_actions) 
						? props.interaction_actions.join(" | ") 
						: (props.interaction_actions || ""),
					evidence: props.evidence || "",
					confidence: props.confidence || "",
					direction: props.direction || "",
					weight: props.weight || "",
					publication: props.publication || props.pubmed || "",
					other_props: Object.keys(props)
						.filter(key => !['interaction_actions', 'evidence', 'confidence', 'direction', 'weight', 'publication', 'pubmed'].includes(key))
						.map(key => `${key}: ${props[key]}`)
						.join("; ")
				};
			});
			
			// Generate CSV content for this relationship type
			const csvContent = generateCsvContent(rows);
			const fileName = `${relType.replace(/[^a-zA-Z0-9]/g, '_')}_edges.csv`;
			zip.file(fileName, csvContent);
		}

		// Add a summary file
		const summaryData = Object.entries(edgesByType).map(([relType, typeEdges]) => ({
			relationship_type: relType,
			count: typeEdges.length,
			description: getRelationshipDescription(relType)
		}));
		const summaryCsv = generateCsvContent(summaryData);
		zip.file("edges_summary.csv", summaryCsv);

		// Generate and download ZIP file
		try {
			const zipBlob = await zip.generateAsync({ type: "blob" });
			const link = document.createElement("a");
			link.href = URL.createObjectURL(zipBlob);
			link.setAttribute("download", "edges_by_type.zip");
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Error creating ZIP file:", error);
			// Fallback to single CSV
			const fallbackRows = edges.map((e) => {
				const props = e.props || {};
				return {
					source_id: e.src,
					target_id: e.dst,
					source_name: nameById.get(String(e.src)) || e.src,
					target_name: nameById.get(String(e.dst)) || e.dst,
					relationship_type: e.type,
					interaction_actions: Array.isArray(props.interaction_actions) 
						? props.interaction_actions.join(" | ") 
						: (props.interaction_actions || ""),
					evidence: props.evidence || "",
					confidence: props.confidence || "",
					direction: props.direction || "",
					weight: props.weight || "",
					publication: props.publication || props.pubmed || "",
					other_props: Object.keys(props)
						.filter(key => !['interaction_actions', 'evidence', 'confidence', 'direction', 'weight', 'publication', 'pubmed'].includes(key))
						.map(key => `${key}: ${props[key]}`)
						.join("; ")
				};
			});
			downloadCsv(fallbackRows, "edges.csv");
		}
	}

	// Helper function to generate CSV content
	function generateCsvContent(rows) {
		if (!rows || rows.length === 0) return "";
		const headers = Object.keys(rows[0]);
		
		// Helper function to properly escape CSV values
		function escapeCsvValue(value) {
			if (value === null || value === undefined) return "";
			const str = String(value);
			// If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
			if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
				return '"' + str.replace(/"/g, '""') + '"';
			}
			return str;
		}
		
		const csv = [
			headers.join(","), 
			...rows.map(r => headers.map(h => escapeCsvValue(r[h] ?? "")).join(","))
		].join("\r\n");
		
		// Add BOM for proper UTF-8 encoding in Excel
		const bom = "\uFEFF";
		return bom + csv;
	}

	// Helper function to get label descriptions
	function getLabelDescription(label) {
		const descriptions = {
			'Gene_Symbol': 'Human gene symbols and identifiers',
			'Gene': 'Genetic entities and gene information',
			'Protein': 'Protein molecules and their properties',
			'Protein_Coding': 'Protein-coding genes and their products',
			'Disease': 'Human diseases and medical conditions',
			'Disorder': 'Genetic and medical disorders',
			'Syndrome': 'Clinical syndromes and disease patterns',
			'Condition': 'Medical conditions and health states',
			'Chemical_Name': 'Chemical compounds and molecules',
			'Drug': 'Pharmaceutical drugs and medications',
			'Compound': 'Chemical compounds and substances',
			'Chemical': 'Chemical entities and compounds',
			'miRNA': 'MicroRNA molecules and regulators',
			'microRNA': 'MicroRNA molecules and regulators',
			'lncRNA': 'Long non-coding RNA molecules',
			'ncRNA': 'Non-coding RNA molecules',
			'RNA': 'RNA molecules and transcripts',
			'Transcription_Factor': 'Transcription factor proteins',
			'TF': 'Transcription factor proteins',
			'TF_Gene': 'Transcription factor genes',
			'Pathway': 'Biological pathways and processes',
			'Process': 'Biological processes and functions',
			'Function': 'Molecular functions and activities',
			'Cell_Type': 'Cell types and cellular entities',
			'Tissue': 'Tissues and anatomical structures',
			'Organ': 'Organs and organ systems',
			'Mutation': 'Genetic mutations and variants',
			'Variant': 'Genetic variants and polymorphisms',
			'SNP': 'Single nucleotide polymorphisms',
			'Interaction': 'Molecular interactions and relationships',
			'Relationship': 'Biological relationships and associations',
			'Association': 'Biological associations and connections',
			'Enzyme': 'Enzymatic proteins and catalysts',
			'Catalyst': 'Catalytic molecules and enzymes',
			'Receptor': 'Receptor proteins and binding sites',
			'Channel': 'Ion channels and transport proteins',
			'Hormone': 'Hormonal molecules and signaling',
			'Signaling': 'Signaling molecules and pathways',
			'Metabolite': 'Metabolic compounds and products',
			'Biomarker': 'Biomarker molecules and indicators'
		};
		
		return descriptions[label] || `Biological entities of type: ${label}`;
	}

	// Helper function to get relationship descriptions
	function getRelationshipDescription(relType) {
		const descriptions = {
			'INTERACTS_WITH': 'Physical or functional interactions between molecules',
			'ENCODES_PROTEIN': 'Gene encoding protein relationships',
			'INFLUENCED_BY': 'Regulatory relationships and influences',
			'ASSOCIATED_WITH': 'Statistical or functional associations',
			'REGULATES': 'Regulatory control relationships',
			'BINDS_TO': 'Physical binding interactions',
			'CATALYZES': 'Enzymatic catalysis relationships',
			'INHIBITS': 'Inhibitory relationships',
			'ACTIVATES': 'Activation relationships',
			'EXPRESSES': 'Expression relationships',
			'LOCALIZES_TO': 'Cellular or subcellular localization',
			'PART_OF': 'Component relationships and hierarchies',
			'CONVERTS': 'Chemical conversion relationships',
			'TRANSPORTS': 'Transport and trafficking relationships',
			'MODIFIES': 'Post-translational modification relationships',
			'Biotype': 'Biological type classifications',
			'Unknown': 'Relationships with unspecified types'
		};
		
		return descriptions[relType] || `Biological relationship of type: ${relType}`;
	}

	function downloadCsv(rows, filename) {
		if (!rows || rows.length === 0) return;
		const csvContent = generateCsvContent(rows);
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		link.href = URL.createObjectURL(blob);
		link.setAttribute("download", filename);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	return (
		<div className="right-pane" style={{ minHeight: 0, display: "flex", flexDirection: "column" }}>
			<div className="tabs" style={{ flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<button className={tab === "nodes" ? "on" : ""} onClick={() => setTab("nodes")}>
					Nodes ({nodeRows.length})
				</button>
				<button className={tab === "edges" ? "on" : ""} onClick={() => setTab("edges")}>
					Edges ({edgeRows.length})
				</button>
				<div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
					<button onClick={downloadNodesCsv}>Download all Nodes (.zip)</button>
					<button onClick={downloadEdgesCsv}>Download all Edges (.zip)</button>
				</div>
			</div>

            <div style={{ flex: "1 1 auto", minHeight: 0 }}>
				{tab === "nodes" ? <NodeTable rows={nodeRows} /> : <EdgeTable rows={edgeRows} nameById={nameById} />}
			</div>
		</div>
	);
}

function NodeTable({ rows }) {
    // Keep the on-screen table compact for readability – just show name & labels.
    const cols = ["name", "labels"];
	return (
		<div className="table-container" style={{ 
			height: "100%", 
			overflow: "auto",
			display: "flex",
			flexDirection: "column"
		}}>
			<table style={{ 
				width: "100%", 
				tableLayout: "auto",
				minWidth: "100%"
			}}>
				<thead>
					<tr>
						{cols.map((c) => (
							<th key={c} style={{ 
								position: "sticky", 
								top: 0, 
								background: "#fff", 
								zIndex: 10, 
								textAlign: "left",
								padding: "12px 16px",
								borderBottom: "2px solid #e2e8f0"
							}}>
								{c.toUpperCase()}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((r) => (
						<tr key={String(r.id)}>
							{cols.map((c) => (
								<td key={c} style={{ 
									wordBreak: "break-word", 
									whiteSpace: "normal",
									padding: "10px 16px",
									borderBottom: "1px solid #f1f5f9"
								}}>
									{renderCell(r, c)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function EdgeTable({ rows, nameById }) {
	const cols = ["src", "dst", "type"];
	return (
		<div className="table-container" style={{ 
			height: "100%", 
			overflow: "auto",
			display: "flex",
			flexDirection: "column"
		}}>
			<table style={{ 
				width: "100%", 
				tableLayout: "auto",
				minWidth: "100%"
			}}>
				<thead>
					<tr>
						{cols.map((c) => (
							<th key={c} style={{ 
								position: "sticky", 
								top: 0, 
								background: "#fff", 
								zIndex: 10, 
								textAlign: "left",
								padding: "12px 16px",
								borderBottom: "2px solid #e2e8f0"
							}}>
								{c.toUpperCase()}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((e, i) => (
						<tr key={i}>
							<td style={{ 
								wordBreak: "break-word",
								padding: "10px 16px",
								borderBottom: "1px solid #f1f5f9"
							}}>
								{nameById.get(String(e.src)) ?? e.src}
							</td>
							<td style={{ 
								wordBreak: "break-word",
								padding: "10px 16px",
								borderBottom: "1px solid #f1f5f9"
							}}>
								{nameById.get(String(e.dst)) ?? e.dst}
							</td>
							<td style={{ 
								wordBreak: "break-word",
								padding: "10px 16px",
								borderBottom: "1px solid #f1f5f9"
							}}>
								{e.type}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

function inferColumns(rows, leading) {
	const set = new Set(leading);
	for (const r of rows) {
		Object.keys((r.props ?? {})).forEach((k) => set.add(k));
		if (Array.isArray(r.labels)) set.add("labels");
	}
	return [...set];
}

function renderCell(row, col) {
	if (col === "labels") return (row.labels ?? []).join(",");
	if (col === "name") return row.name || (row.props && row.props.name) || "";
	if (row.props && col in row.props) {
		const v = row.props[col];
		if (Array.isArray(v)) return v.join(", ");
		if (v && typeof v === "object") return JSON.stringify(v);
		return String(v);
	}
	return row[col] ?? "";
}


