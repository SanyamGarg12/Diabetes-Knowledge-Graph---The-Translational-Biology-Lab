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
		const rows = [...nodes.values()].map((n) => ({
			id: n.id,
			name: n.name || (n.props && n.props.name) || "",
			labels: Array.isArray(n.labels) ? n.labels.join("|") : (n.label || ""),
			props: JSON.stringify(n.props || {}),
		}));
		downloadCsv(rows, "nodes.csv");
	}

	function downloadEdgesCsv() {
		const rows = edges.map((e) => ({
			src: e.src,
			dst: e.dst,
			type: e.type,
			props: JSON.stringify(e.props || {}),
		}));
		downloadCsv(rows, "edges.csv");
	}

	function downloadCsv(rows, filename) {
		if (!rows || rows.length === 0) return;
		const headers = Object.keys(rows[0]);
		const csv = [headers.join(","), ...rows.map(r => headers.map(h => JSON.stringify(r[h] ?? "")).join(","))].join("\r\n");
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
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
					<button onClick={downloadNodesCsv}>Download Nodes CSV</button>
					<button onClick={downloadEdgesCsv}>Download Edges CSV</button>
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
		<div className="table scroll-y" style={{ maxHeight: "calc(100vh - 160px)", overflowY: "auto", overflowX: "auto" }}>
			<table style={{ width: "100%", tableLayout: "fixed" }}>
				<thead>
					<tr>
						{cols.map((c) => (
							<th key={c} style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1, textAlign: "left" }}>
								{c}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((r) => (
						<tr key={String(r.id)}>
							{cols.map((c) => (
								<td key={c} style={{ wordBreak: "break-word", whiteSpace: "normal" }}>{renderCell(r, c)}</td>
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
		<div className="table scroll-y" style={{ maxHeight: "calc(100vh - 160px)", overflowY: "auto", overflowX: "auto" }}>
			<table style={{ width: "100%", tableLayout: "fixed" }}>
				<thead>
					<tr>
						{cols.map((c) => (
							<th key={c} style={{ position: "sticky", top: 0, background: "#fff", zIndex: 1, textAlign: "left" }}>
								{c}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{rows.map((e, i) => (
						<tr key={i}>
							<td style={{ wordBreak: "break-word" }}>{nameById.get(String(e.src)) ?? e.src}</td>
							<td style={{ wordBreak: "break-word" }}>{nameById.get(String(e.dst)) ?? e.dst}</td>
							<td style={{ wordBreak: "break-word" }}>{e.type}</td>
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


