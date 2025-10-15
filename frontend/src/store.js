import { create } from "zustand";

export const useApp = create((set, get) => ({
	q: "",
	label: undefined,
	field: undefined,
	hits: [],
	seed: undefined,
	nodes: new Map(),
	edges: [],
	selectedLabels: [],
	selectedRelTypes: [],
	excludeIds: new Set(),
	setQuery: (q) => set({ q }),
	setLabel: (label) => set({ label }),
	setField: (field) => set({ field }),
	setHits: (hits) => set({ hits }),
	setSeed: (seed) =>
		set({
			seed,
			nodes: seed ? new Map([[seed.id, { id: seed.id }]]) : new Map(),
			edges: [],
			excludeIds: seed ? new Set([seed.id]) : new Set(),
		}),
	mergeGraph: (nodeList, edgeList) => {
		const nodes = new Map(get().nodes);
		const excludeIds = new Set(get().excludeIds);
		for (const n of nodeList) {
			nodes.set(n.id, n);
			excludeIds.add(n.id);
		}
		const edges = [...get().edges, ...edgeList];
		set({ nodes, edges, excludeIds });
	},
	setFilters: (labels, rels) => set({ selectedLabels: labels, selectedRelTypes: rels }),
}));


