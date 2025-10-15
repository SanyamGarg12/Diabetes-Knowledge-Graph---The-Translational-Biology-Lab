import axios from "axios";

export const api = axios.create({ baseURL: "/" });

export async function search(q, label, field) {
	const params = { q, limit: 20 };
	if (label) params.label = label;
	if (field) params.field = field;
	const { data } = await api.get("/v1/search", { params });
	return data;
}

export async function getProperties(label) {
	const { data } = await api.get("/v1/schema/properties", { params: { label } });
	return data;
}

export async function getNeighbors(id, opts) {
	const { data } = await api.get(`/v1/nodes/${id}/neighbors`, { params: opts });
	return data;
}

export async function getFacets(id) {
	const { data } = await api.get(`/v1/nodes/${id}/facets`);
	return data;
}


