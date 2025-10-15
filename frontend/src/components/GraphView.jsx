import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { useApp } from "../store";

export default function GraphView() {
	const cyRef = useRef(null);
	const containerRef = useRef(null);
	const { nodes, edges, seed } = useApp();

	useEffect(() => {
		if (!containerRef.current) return;
		if (!cyRef.current) {
			cyRef.current = cytoscape({
				container: containerRef.current,
				style: [
					{ selector: "node", style: { label: "data(label)", "font-size": 10, "background-color": "#89b" } },
					{ selector: "edge", style: { "curve-style": "bezier", width: 1, "line-color": "#bbb", "font-size": 8, label: "data(label)" } },
					{ selector: ".seed", style: { "background-color": "#e67" } }
				],
				wheelSensitivity: 0.2,
			});
		}
		const cy = cyRef.current;
		cy.elements().remove();

		const N = [...nodes.values()];
		const E = edges;
		const maxRender = 1200;
		const nlim = Math.min(N.length, Math.floor(maxRender * 0.6));
		const elim = Math.min(E.length, Math.floor(maxRender * 0.4));

		const cyNodes = N.slice(0, nlim).map((n) => ({
			data: {
				id: String(n.id),
				label: n.name || (n.props && n.props.name) || (Array.isArray(n.labels) && n.labels[0]) || "Node",
			},
			classes: seed && n.id === seed.id ? "seed" : "",
		}));

		const cyEdges = E.slice(0, elim).map((e, idx) => ({
			data: { id: `${e.src}-${e.dst}-${e.type}-${idx}`, source: String(e.src), target: String(e.dst), label: e.type },
		}));

		cy.add([...cyNodes, ...cyEdges]);
		cy.layout({ name: "cose", animate: false }).run();
	}, [nodes, edges, seed]);

	return <div ref={containerRef} className="graph" />;
}


