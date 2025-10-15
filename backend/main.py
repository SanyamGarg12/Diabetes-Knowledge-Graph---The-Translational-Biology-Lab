from fastapi import FastAPI, Query, HTTPException, Path as PathParam
from fastapi.responses import FileResponse
from neo4j import GraphDatabase
from fastapi.middleware.cors import CORSMiddleware
from ollama import Client
from typing import Dict, Any, List
import random
import re
import os
from pathlib import Path

# Initialize FastAPI
app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update this to restrict origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Ollama client
ollama_client = Client(host='http://192.168.22.52:11434')

# Neo4j Connection Settings
NEO4J_URI = "bolt://localhost:7687"
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "12345678"
DB_NAME = "neo4j"

# File paths
DOWNLOAD_PATH = Path("downloads")

# --- Config aligned with only_search_tab/server/src/config.ts ---
LABELS = [
    'Gene_Symbol', 'Protein_Family', 'Disease', 'Protein', 'Enzyme', 'Drug_name',
    'Chemical_Name', 'lncRNA', 'Kegg', 'Reaction',
    'GO_Biological_Process_ID', 'GO_Cellular_Component_ID', 'GO_Molecular_Function_ID', 'miRNA'
]

PROPS_BY_LABEL: Dict[str, List[str]] = {
    'Gene_Symbol': ['hgnc','entrez_id','ensembl_id','alias','is_transcriptional_factor','name'],
    'Protein_Family': ['name'],
    'Disease': ['MeSH_ID','omim_id','name'],
    'Protein': ['AlphaFoldDB','Entry','Enzyme','InterPro','Length','PROSITE','Pfam','ProteinNames','name'],
    'Drug_name': ['Clinical_status','name'],
    'Chemical_Name': ['chemical_id','interaction','interaction_action','name'],
    'lncRNA': ['ChromosomalLocation','causal_description','Pubmed_ids','name'],
    'Kegg': ['pathway_name','name'],
    'Reaction': ['Rhea_ID','name'],
    'GO_Biological_Process_ID': ['GO_Biological_Process_TERM','name'],
    'GO_Cellular_Component_ID': ['GO_Cellular_Component_TERM','name'],
    'GO_Molecular_Function_ID': ['GO_Molecular_Function_TERM','name'],
    'miRNA': ['name']
}

LIMITS = {
    'SEARCH_TOP': 50,
    'FTS_CANDIDATES': 150,
    'PREFIX_CANDIDATES': 50,
    'FIELD_CANDIDATES': 120,
}

# Basic ID pattern routing similar to only_search_tab
ID_PATTERNS: List[Dict[str, Any]] = [
    { 'key': 'hgnc', 're': re.compile(r'^hgnc:\s*\d+$', re.I), 'labels': ['Gene_Symbol'], 'prop': 'hgnc' },
    { 'key': 'entrez', 're': re.compile(r'^entrez:\s*\d+$', re.I), 'labels': ['Gene_Symbol'], 'prop': 'entrez_id' },
    { 'key': 'ensembl', 're': re.compile(r'^ensembl:\s*ensg\d+', re.I), 'labels': ['Gene_Symbol'], 'prop': 'ensembl_id' },
    { 'key': 'omim', 're': re.compile(r'^omim:\s*\d+$', re.I), 'labels': ['Disease'], 'prop': 'omim_id' },
    { 'key': 'mesh', 're': re.compile(r'^mesh:\s*[a-z]?\d+$', re.I), 'labels': ['Disease'], 'prop': 'MeSH_ID' },
    { 'key': 'rhea', 're': re.compile(r'^rhea:\s*\d+$', re.I), 'labels': ['Reaction'], 'prop': 'Rhea_ID' },
]

def get_file_size(file_path: Path) -> str:
    """Convert file size to human readable format"""
    size_bytes = file_path.stat().st_size
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024
    return f"{size_bytes:.1f} TB"

@app.get("/api/files")
async def list_files():
    """
    List all CSV files in the downloads directory
    """
    files = []
    
    if DOWNLOAD_PATH.exists():
        for file_path in DOWNLOAD_PATH.glob("*.csv"):
            if file_path.is_file():
                files.append({
                    "name": file_path.name,
                    "size": get_file_size(file_path)
                })
    
    return files

@app.get("/download/{filename}")
async def download_file(filename: str):
    """
    Download a file from the downloads directory
    """
    file_path = DOWNLOAD_PATH / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(
        path=file_path,
        filename=filename,
        media_type="text/csv"
    )

# Neo4j Connection Class


class Neo4jConnection:
    def __init__(self, uri, user, password, database):
        self.driver = GraphDatabase.driver(uri, auth=(user, password))
        self.database = database

    def close(self):
        self.driver.close()

    def execute_query(self, query):
        with self.driver.session(database=self.database) as session:
            result = session.run(query)
            return [record.data() for record in result]

    def get_database_info(self):
        try:
            # Get node counts
            node_counts = self.execute_query("""
                MATCH (n)
                RETURN labels(n) as label, count(*) as count
                ORDER BY label
            """)

            # Get relationship counts
            rel_counts = self.execute_query("""
                MATCH ()-[r]->()
                RETURN type(r) as type, count(*) as count
                ORDER BY type
            """)

            # Get database name and status
            db_info = self.execute_query("""
                CALL dbms.listConfig() YIELD name, value
                WHERE name IN ['dbms.database.name', 'dbms.memory.heap.initial_size', 'dbms.memory.heap.max_size']
                RETURN name, value
            """)

            return {
                "status": "connected",
                "database_name": self.database,
                "node_counts": node_counts,
                "relationship_counts": rel_counts,
                "database_config": db_info
            }
        except Exception as e:
            return {
                "status": "error",
                "error": str(e)
            }


# Initialize Neo4j connection
neo4j_conn = Neo4jConnection(NEO4J_URI, NEO4J_USER, NEO4J_PASSWORD, DB_NAME)


ollama_client = Client(host='http://192.168.22.52:11434')


def generate_cypher_query(natural_query: str):
    prompt = f"""
You are a Cypher query generator for a Neo4j database. Return strictly two complete Cypher queries, separated by a newline. Do not include any explanation, markdown, or comments.

### Node Labels and Properties:
- Gene_Symbol: name, hgnc, entrez_id, ensembl_id, alias, is_transcriptional_factor, Chromosomal_Location
- Protein: Entry, Enzyme, Length, Pfam, InterPro, dbSNP, AlphaFoldDB, PROSITE, PDBsum, ProteinNames, PDB
- lncRNA: name, pubmed_ids, Chromosomal_Location
- miRNA: name
- Reaction: name, Rhea_ID
- Kegg: name, pathway_name
- GO_Molecular_Function_ID: name, GO_Molecular_Function_TERM
- GO_Cellular_Component_ID: name, GO_Cellular_Component_TERM
- GO_Biological_Process_ID: name, GO_Biological_Process_TERM
- Drug_Name: name, clinical_status
- Disease: name, MeSH_ID, omim_id
- Chemical_Name: name, chemical_id, interaction, interaction_actions

### Relationships:
- (g:Gene_Symbol)-[:ENCODES_PROTEIN]->(p:Protein)
- (g:Gene_Symbol)-[:Biotype]->(d:Disease) WHERE Biotype.name IN ['Protein Coding', 'RNA, micro', 'RNA, long non-coding', 'Pseudogenes', 'Associated With']
- (g:Gene_Symbol)-[:INFLUENCED_BY]->(m:miRNA)
- (g:Gene_Symbol)-[:HAS_TARGET]->(t:Gene_Symbol)
- (g:Gene_Symbol)-[:INVOLVED_IN_PATHWAY]->(k:Kegg)
- (p:Protein)-[:CATALYZES]->(r:Reaction)
- (d:Disease)-[:HAS_DISEASE_lncRNA_ASSOCIATION]->(l:lncRNA)
- (d:Drug_Name)-[:HAS_DRUG_TARGET]->(g:Gene_Symbol)
- (c:Chemical_Name)-[:INTERACTS_WITH]->(g:Gene_Symbol)
- (g:Gene_Symbol)-[:PARTICIPATES_IN_Molecular_Function]->(:GO_Molecular_Function_ID)
- (g:Gene_Symbol)-[:PARTICIPATES_IN_Cellular_Component]->(:GO_Cellular_Component_TERM)
- (g:Gene_Symbol)-[:PARTICIPATES_IN_Biological_Process]->(:GO_Biological_Process_TERM)

### Valid Disease Names:
- 'TBT2DM', 'Neuropathy', 'Cardiovascular', 'Retinopathy', 'Diabetes',
  'Nephropathy', 'Insulin resistance', 'Atherosclerosis',
  'Dyslipidemia-associated atherosclerosis', 'Dyslipidemia-associated Psoriasis'

- **Do not use the `WITH` clause** in any of the queries.
- Strictly output exactly 2 complete Cypher queries on 2 separate lines:
    1. Visualization query (should start with MATCH and end with RETURN)
    2. Table query (should start with MATCH and contain RETURN)
- Strictly DO NOT USE LIMIT in any of the queries.

### Task:
Given this query: "{natural_query}"

Strictly output only the two required complete Cypher queries on two separate lines — no comments, no extra text, no markdown.
"""

    try:
        response = ollama_client.generate(
            model="gemma3:12b", # Or your preferred model
            prompt=prompt,
            system="You are an expert in Cypher and Neo4j. Return exactly two complete and executable queries as specified.",
            stream=False,
            raw=False,
            keep_alive="10m"
        )

        output = response["response"].strip()
        lines = output.split("\n")

        if len(lines) < 2:
            raise ValueError(
                f"Ollama output did not contain 2 lines. Output:\n{output}"
            )

        visualization_query = lines[0].strip()
        table_query = lines[1].strip()

        # Basic validation: Ensure queries look like valid Cypher
        if not (visualization_query.lower().startswith("match") and "return" in visualization_query.lower()):
             raise ValueError(f"Visualization query does not contain MATCH and RETURN: {visualization_query}")
        if not (table_query.lower().startswith("match") and "return" in table_query.lower()):
             raise ValueError(f"Table query does not contain MATCH and RETURN: {table_query}")

        print("Visualization Query from Ollama:\n", visualization_query)
        print("Table Query from Ollama:\n", table_query)

        return visualization_query, table_query

    except Exception as e:
        raise ValueError(f"Ollama query generation error: {str(e)}")


def process_neo4j_result_for_sigma(records: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
    """
    Convert Neo4j query results to Sigma.js compatible format
    """
    nodes = []
    edges = []
    node_ids = set()
    edge_id_counter = 1

    for record in records:
        # Process nodes
        for key, value in record.items():
            if isinstance(value, dict) and 'name' in value:
                node_id = value['name']
                if node_id not in node_ids:
                    node_data = {
                        "id": node_id,
                        "label": node_id,
                        "x": random.uniform(0, 100),
                        "y": random.uniform(0, 100),
                        "size": 5,
                        "color": "#0074D9",
                        "properties": {k: v for k, v in value.items() if k != 'name'}
                    }
                    nodes.append(node_data)
                    node_ids.add(node_id)

        # Process relationships (edges)
        keys = list(record.keys())
        if len(keys) >= 2:
            source = record[keys[0]].get('name', keys[0]) if isinstance(
                record[keys[0]], dict) else str(record[keys[0]])
            target = record[keys[1]].get('name', keys[1]) if isinstance(
                record[keys[1]], dict) else str(record[keys[1]])

            if source in node_ids and target in node_ids:
                edges.append({
                    "id": f"e{edge_id_counter}",
                    "source": source,
                    "target": target,
                    "label": keys[1] if len(keys) > 1 else "RELATED_TO",
                    "size": 1,
                    "color": "#ccc"
                })
                edge_id_counter += 1

    return {
        "nodes": nodes,
        "edges": edges
    }


@app.get("/query")
def process_query(user_query: str = Query(..., description="Natural language query")):
    try:
        visualization_query, table_query = generate_cypher_query(user_query)

        print("Executable Visualization Query:\n", visualization_query)
        print("Table Query:\n", table_query)

    except Exception as e:
        return {"error": f"Failed to generate Cypher: {str(e)}"}

    try:
        # Execute visualization query
        vis_result = neo4j_conn.execute_query(visualization_query)
        sigma_data = process_neo4j_result_for_sigma(vis_result)

        # Execute table query
        table_result = neo4j_conn.execute_query(table_query)

        return {
            "cypher_queries": {
                "visualization": visualization_query,
                "table": table_query
            },
            "results": {
                "graph": sigma_data,
                "table": table_result
            }
        }

    except Exception as e:
        return {"error": str(e)}


@app.get("/api/health/neo4j")
async def check_neo4j_connection():
    try:
        test_query = "RETURN 1 as test"
        neo4j_conn.execute_query(test_query)

        # Get detailed database information
        db_info = neo4j_conn.get_database_info()

        return {
            "status": "success",
            "message": "Successfully connected to Neo4j database",
            "database_info": db_info
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to connect to Neo4j database: {str(e)}"
        }

def get_file_type(filename: str) -> str:
    """Get file type from extension"""
    ext = filename.split('.')[-1].lower()
    type_map = {
        'pdf': 'PDF',
        'csv': 'CSV',
        'xlsx': 'Excel',
        'json': 'JSON',
        'txt': 'Text',
        'doc': 'Word',
        'docx': 'Word'
    }
    return type_map.get(ext, ext.upper())

# Run FastAPI (if needed locally)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

# --- New endpoints to support only_search_tab client ---

def _to_number(v):
    try:
        return v.to_number() if hasattr(v, "to_number") else int(v)
    except Exception:
        return v

def _quote(value: Any) -> str:
    s = str(value)
    s = s.replace("\\", "\\\\").replace("'", "\\'")
    return f"'{s}'"

@app.get("/v1/search")
def v1_search(q: str = Query(...), label: str | None = Query(None), field: str | None = Query(None), limit: int = Query(20, ge=1, le=100)):
    labels = [label] if label else None

    results: List[Dict[str, Any]] = []

    # 0) ID pattern routing (exact matches by known identifier shapes)
    q_trim = q.strip()
    for pat in ID_PATTERNS:
        if pat['re'].match(q_trim):
            for lab in pat['labels']:
                cy = (
                    f"MATCH (n:{lab}) WHERE toLower(toString(n.{pat['prop']})) = toLower($v) "
                    "RETURN id(n) AS id, labels(n) AS labels, properties(n) AS props LIMIT 20"
                )
                rows = neo4j_conn.execute_query(cy.replace("$v", _quote(q_trim)))
                for r in rows:
                    results.append({
                        "id": _to_number(r.get("id")),
                        "labels": r.get("labels", []),
                        "props": r.get("props", {}),
                    })
            if results:
                return {"results": results[:limit]}

    # 1) Full-text index if available
    try:
        cypher = (
            "CALL db.index.fulltext.queryNodes('node_search', $q) YIELD node, score "
            "WHERE $labels IS NULL OR any(l IN labels(node) WHERE l IN $labels) "
            "RETURN id(node) AS id, labels(node) AS labels, properties(node) AS props, score "
            "ORDER BY score DESC LIMIT toInteger($lim)"
        )
        rows = neo4j_conn.execute_query(cypher.replace("$q", _quote(q)).replace("$labels", "null" if labels is None else str(labels)).replace("$lim", str(limit)))
        for r in rows:
            id_val = r.get("id")
            results.append({
                "id": _to_number(id_val) if id_val is not None else None,
                "labels": r.get("labels", []),
                "props": r.get("props", {}),
            })
    except Exception:
        pass

    # 2) Field contains (if allowed)
    if label and field and (PROPS_BY_LABEL.get(label) and field in PROPS_BY_LABEL[label]):
        cy_field = (
            f"MATCH (n:{label}) "
            f"WHERE toLower(toString(coalesce(n.{field}, ''))) CONTAINS toLower($q) "
            "RETURN id(n) AS id, labels(n) AS labels, properties(n) AS props "
            "LIMIT toInteger($lim)"
        )
        rows = neo4j_conn.execute_query(cy_field.replace("$q", _quote(q)).replace("$lim", str(limit)))
        for r in rows:
            results.append({
                "id": _to_number(r.get("id")),
                "labels": r.get("labels", []),
                "props": r.get("props", {}),
            })

    # 3) Name prefix helper
    if not results:
        cypher = (
            "MATCH (n) "
            "WHERE n.name IS NOT NULL AND toLower(n.name) STARTS WITH toLower($q) "
            "RETURN id(n) AS id, labels(n) AS labels, properties(n) AS props "
            "LIMIT toInteger($lim)"
        )
        rows = neo4j_conn.execute_query(cypher.replace("$q", _quote(q)).replace("$lim", str(limit)))
        for r in rows:
            results.append({
                "id": _to_number(r.get("id")),
                "labels": r.get("labels", []),
                "props": r.get("props", {}),
            })

    return {"results": results}


@app.get("/v1/nodes/{node_id}/facets")
def v1_facets(node_id: int = PathParam(...)):
    cypher = (
        "MATCH (seed) WHERE id(seed) = $id "
        "MATCH (seed)-[r]-(m) "
        "RETURN labels(m)[0] AS neighborLabel, type(r) AS relType, count(*) AS cnt "
        "ORDER BY cnt DESC LIMIT 500"
    )
    rows = neo4j_conn.execute_query(cypher.replace("$id", str(node_id)))
    data = [{"neighborLabel": r.get("neighborLabel"), "relType": r.get("relType"), "cnt": int(r.get("cnt", 0))} for r in rows]
    return {"rows": data}


@app.get("/v1/nodes/{node_id}/neighbors")
def v1_neighbors(node_id: int = PathParam(...), relTypes: str | None = Query(None), neighborLabels: str | None = Query(None), names: str | None = Query(None), minConfidence: float | None = Query(None), limit: int = Query(300, ge=1, le=1000), exclude: str | None = Query(None)):
    rels = [s.strip() for s in relTypes.split(",")] if relTypes else None
    labs = [s.strip() for s in neighborLabels.split(",")] if neighborLabels else None
    namesLc = [s.strip().lower() for s in names.split(",")] if names else []
    excludeIds = [int(x) for x in exclude.split(",") if x.strip().isdigit()] if exclude else []

    where_parts = ["id(seed) = $id"]
    if rels:
        where_parts.append("type(r) IN $rels")
    if labs:
        where_parts.append("any(l IN labels(m) WHERE l IN $labs)")
    if minConfidence is not None:
        where_parts.append("coalesce(r.confidence,0.0) >= $minConf")
    if namesLc:
        where_parts.append("toLower(coalesce(m.name,'')) IN $names")
    if excludeIds:
        where_parts.append("NOT id(m) IN $excludeIds")

    where_clause = " AND ".join(["(" + w + ")" for w in where_parts])
    cypher = (
        "MATCH (seed),(seed)-[r]-(m) WHERE " + where_clause + " "
        "RETURN id(seed) AS src, type(r) AS rel, id(m) AS dst, labels(m) AS dstLabels, properties(m) AS dstProps, properties(r) AS relProps "
        "LIMIT toInteger($lim)"
    )
    params = {
        "id": node_id,
        "rels": rels,
        "labs": labs,
        "minConf": minConfidence,
        "names": namesLc,
        "excludeIds": excludeIds,
        "lim": limit,
    }
    # naive templating for our simple executor
    q = cypher
    for k, v in list(params.items()):
        if v is None:
            q = q.replace(f"${k}", "null")
        elif isinstance(v, str):
            q = q.replace(f"${k}", f'"{v}"')
        else:
            q = q.replace(f"${k}", str(v))

    rows = neo4j_conn.execute_query(q)
    nodes: Dict[int, Any] = {}
    edges = []

    # seed metadata
    seed_meta_rows = neo4j_conn.execute_query(f"MATCH (s) WHERE id(s) = {node_id} RETURN labels(s) AS labels, properties(s) AS props")
    seed_labels = seed_meta_rows[0].get("labels") if seed_meta_rows else ["Node"]
    seed_props = seed_meta_rows[0].get("props") if seed_meta_rows else {}
    nodes[node_id] = {"id": node_id, "uid": node_id, "label": (seed_labels[0] if seed_labels else "Node"), "labels": seed_labels, "name": seed_props.get("name") if isinstance(seed_props, dict) else None, "props": seed_props}

    for r in rows:
        dst = _to_number(r.get("dst"))
        dst_labels = r.get("dstLabels") or []
        dst_props = r.get("dstProps") or {}
        rel_type = r.get("rel")
        rel_props = r.get("relProps") or {}
        if dst not in nodes:
            primary = dst_labels[0] if dst_labels else "Node"
            nodes[dst] = {"id": dst, "uid": dst, "label": primary, "labels": dst_labels, "name": (dst_props.get("name") if isinstance(dst_props, dict) else None), "props": dst_props}
        edges.append({"src": node_id, "dst": dst, "type": rel_type, "props": rel_props})

    return {"nodes": list(nodes.values()), "edges": edges}


@app.get("/v1/schema/properties")
def v1_schema_properties(label: str = Query(...)):
    total_rows = neo4j_conn.execute_query(f"MATCH (n:{label}) RETURN count(n) AS c")
    total = int(total_rows[0].get("c")) if total_rows else 0
    rows = neo4j_conn.execute_query(
        f"MATCH (n:{label}) UNWIND keys(n) AS prop RETURN prop, count(*) AS cnt ORDER BY cnt DESC LIMIT 200"
    )
    all_props = [{"prop": r.get("prop"), "cnt": int(r.get("cnt", 0))} for r in rows]
    allowed = PROPS_BY_LABEL.get(label)
    if allowed:
        all_props = [p for p in all_props if p["prop"] in allowed]
        # ensure 'name' is present at least once
        if 'name' not in [p['prop'] for p in all_props]:
            all_props = [{"prop": "name", "cnt": total}] + all_props
    properties = [{"prop": p["prop"], "cnt": p["cnt"], "coverage": (p["cnt"] / total if total else 0)} for p in all_props]
    return {"label": label, "total": total, "properties": properties}


# --- Diagnostics to align with a new dump ---
@app.get("/v1/schema/labels")
def v1_schema_labels():
    rows = neo4j_conn.execute_query("""
      MATCH (n)
      WITH labels(n) AS labs
      UNWIND labs AS lab
      RETURN lab AS label, count(*) AS cnt
      ORDER BY cnt DESC
    """)
    return {"labels": [{"label": r.get("label"), "count": int(r.get("cnt", 0))} for r in rows]}


@app.get("/v1/schema/summary")
def v1_schema_summary(top:int = Query(25, ge=1, le=200)):
    labels_rows = neo4j_conn.execute_query("""
      MATCH (n)
      WITH labels(n) AS labs
      UNWIND labs AS lab
      RETURN lab AS label, count(*) AS cnt
      ORDER BY cnt DESC
    """)
    out: Dict[str, Any] = {"labels": [{"label": r.get("label"), "count": int(r.get("cnt", 0))} for r in labels_rows], "properties": []}
    for item in out["labels"]:
        lab = item["label"]
        props_rows = neo4j_conn.execute_query(f"""
          MATCH (n:`{lab}`)
          UNWIND keys(n) AS prop
          RETURN prop, count(*) AS cnt
          ORDER BY cnt DESC LIMIT {top}
        """)
        out["properties"].append({
            "label": lab,
            "total": item["count"],
            "props": [{"prop": r.get("prop"), "cnt": int(r.get("cnt", 0))} for r in props_rows]
        })
    return out
