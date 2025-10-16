import React, { useMemo, useState } from "react";
import { useApp } from "../store";

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


	function downloadNodesCsv() {
		const rows = [...nodes.values()].map((n) => {
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
		downloadCsv(rows, "nodes.csv");
	}

	function downloadEdgesCsv() {
		const nameById = new Map();
		for (const n of [...nodes.values()]) {
			const name = n.name || (n.props && n.props.name) || String(n.id);
			nameById.set(String(n.id), name);
		}

		const rows = edges.map((e) => {
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
				// Add more common edge properties
				direction: props.direction || "",
				weight: props.weight || "",
				publication: props.publication || props.pubmed || "",
				// Keep a cleaned version of other props
				other_props: Object.keys(props)
					.filter(key => !['interaction_actions', 'evidence', 'confidence', 'direction', 'weight', 'publication', 'pubmed'].includes(key))
					.map(key => `${key}: ${props[key]}`)
					.join("; ")
			};
		});
		downloadCsv(rows, "edges.csv");
	}

	function downloadCsv(rows, filename) {
		if (!rows || rows.length === 0) return;
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
		const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
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
					<button onClick={downloadNodesCsv}>Download all Nodes (.csv)</button>
					<button onClick={downloadEdgesCsv}>Download all Edges (.csv)</button>
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


