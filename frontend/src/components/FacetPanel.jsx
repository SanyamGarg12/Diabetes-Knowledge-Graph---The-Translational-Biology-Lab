import React, { useMemo } from "react";
import { useApp } from "../store";

export default function FacetPanel({ seedId, facets }) {
	const { selectedLabels, selectedRelTypes, setFilters } = useApp();

	const labelCounts = useMemo(() => {
		const map = new Map();
		for (const r of facets) map.set(r.neighborLabel, (map.get(r.neighborLabel) || 0) + r.cnt);
		return [...map.entries()].sort((a, b) => b[1] - a[1]);
	}, [facets]);

	const relCounts = useMemo(() => {
		const map = new Map();
		for (const r of facets) map.set(r.relType, (map.get(r.relType) || 0) + r.cnt);
		return [...map.entries()].sort((a, b) => b[1] - a[1]);
	}, [facets]);

	function toggle(arr, v) {
		return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
	}

	return (
		<div className="facet">
			<h4>Neighbor labels</h4>
			<div className="chips">
				{labelCounts.map(([lab, cnt]) => (
					<button
						key={lab}
						className={selectedLabels.includes(lab) ? "chip on" : "chip"}
						onClick={() => setFilters(toggle(selectedLabels, lab), selectedRelTypes)}
					>
						{lab} ({cnt})
					</button>
				))}
			</div>

			<h4>Relation types</h4>
			<div className="chips">
				{relCounts.map(([rt, cnt]) => (
					<button
						key={rt}
						className={selectedRelTypes.includes(rt) ? "chip on" : "chip"}
						onClick={() => setFilters(selectedLabels, toggle(selectedRelTypes, rt))}
					>
						{rt} ({cnt})
					</button>
				))}
			</div>
		</div>
	);
}


