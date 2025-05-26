# now see the below is my final backend:
from fastapi import FastAPI, Query
from neo4j import GraphDatabase
from fastapi.middleware.cors import CORSMiddleware
from ollama import Client
from typing import Dict, Any, List
import random
import re

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
NEO4J_PASSWORD = "123456789"
DB_NAME = "diabeteskbnew"

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
        if not (visualization_query.lower().startswith("match") and " return " in visualization_query.lower()):
             raise ValueError(f"Visualization query does not contain MATCH and RETURN: {visualization_query}")
        if not (table_query.lower().startswith("match") and " return " in table_query.lower()):
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

# Run FastAPI (if needed locally)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
