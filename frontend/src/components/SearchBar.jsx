import React, { useEffect, useState } from "react";
import { useApp } from "../store";
import { getProperties, api } from "../api";

export default function SearchBar({ onSearch, loading }) {
	const { q, setQuery, label, setLabel, field, setField } = useApp();
	const [fields, setFields] = useState(["name"]);
	const [labels, setLabels] = useState(["All"]);

	useEffect(() => {
		async function loadLabels() {
			try {
				const { data } = await api.get("/v1/schema/labels");
				const names = Array.isArray(data?.labels) ? data.labels.map((x) => x.label) : [];
				setLabels(["All", ...names]);
			} catch {
				setLabels(["All","Disease","Gene_Symbol"]);
			}
		}
		loadLabels();
	}, []);

	useEffect(() => {
		async function load() {
			if (!label || label === "All") {
				setFields(["name"]);
				setField("name");
				return;
			}
			try {
				const data = await getProperties(label);
				const props = (data.properties || []).map((p) => p.prop);
				setFields(props.includes("name") ? props : ["name", ...props]);
				if (!props.includes(field || "name")) setField("name");
			} catch {
				setFields(["name"]);
				setField("name");
			}
		}
		load();
	}, [label]);

	const disabled = loading || !(q && q.trim());

	return (
		<div className="searchbar">
			<select value={label ?? "All"} onChange={(e) => setLabel(e.target.value === "All" ? undefined : e.target.value)}>
				{labels.map((l) => (
					<option key={l} value={l}>
						{l}
					</option>
				))}
			</select>
			<select value={field ?? "name"} onChange={(e) => setField(e.target.value)}>
				{fields.map((f) => (
					<option key={f} value={f}>
						{f}
					</option>
				))}
			</select>
			<input
				placeholder="Search…"
				value={q}
				onChange={(e) => setQuery(e.target.value)}
				onKeyDown={(e) => e.key === "Enter" && onSearch()}
			/>
			<button onClick={onSearch} disabled={disabled}>
				{loading ? "Searching…" : "Search"}
			</button>
		</div>
	);
}
