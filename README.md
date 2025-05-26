# Diabetes Knowledge Graph

## Project Description

This project is an interactive web application for exploring a knowledge graph related to Translational Biology, with a focus on Diabetes Type 2. It allows users to query the knowledge graph using natural language, visualize the relationships between biological entities such as genes, proteins, diseases, and drugs, and view relevant data in a structured table format.

The application consists of a frontend built with React, a backend powered by FastAPI and Python, and utilizes a Neo4j graph database to store the knowledge graph. Natural language queries are processed by an Ollama-based language model to generate Cypher queries for the database.

## Tech Stack

*   **Frontend:**
    *   React (with Vite)
    *   JavaScript/JSX
    *   Custom CSS (and potentially Tailwind CSS)
    *   Sigma.js (for graph visualization)
    *   Framer Motion (for animations)
    *   Axios (for API calls)
    *   React Router (for navigation)

*   **Backend:**
    *   FastAPI (Python)
    *   Neo4j Python Driver
    *   Ollama Python Library
    *   Python

*   **Database:**
    *   Neo4j Graph Database

*   **AI Model:**
    *   Ollama (specifically using the `gemma3:12b` model for Cypher generation)

## Data Sources

The knowledge graph is populated with data sourced from various high-quality biomedical databases, including:

*   OMIM (Online Mendelian Inheritance in Man)
*   NCBI (National Center for Biotechnology Information)
*   CTD (Comparative Toxicogenomics Database)
*   TTD (Therapeutic Target Database)
*   HUGO (HUGO Gene Nomenclature Committee)
*   miRTarBase
*   T2Diacod
*   DisGeNET
*   Rhea (Biochemical Reactions Database)
*   KEGG (Kyoto Encyclopedia of Genes and Genomes)
*   Gene Ontology
*   AlphaFold Protein Structure Database
*   UniProt (Universal Protein Resource)
*   InterPro (Integrated Protein Family Database)
*   PROSITE (Protein Families and Domains Database)
*   DbKB (Disease Knowledge Base)

Information is also incorporated from research papers published between 2000 and 2025 on PubMed.

## Setup and Running the Project

To set up and run the project locally, follow these steps:

### Prerequisites

*   Python 3.8+
*   Node.js (LTS version recommended)
*   Neo4j Desktop or Server (with a database named `diabeteskbnew`)
*   Ollama (with the `gemma3:12b` model pulled)

### 1. Clone the Repository

```bash
git clone <repository_url>
cd <repository_name>
```

### 2. Set up the Backend

Navigate to the `backend` directory:

```bash
cd backend
```

Create a virtual environment and activate it:

```bash
python -m venv venv
# On Windows
venv\Scripts\activate
# On macOS/Linux
source venv/bin/activate
```

Install the backend dependencies:

```bash
pip install -r requirements.txt
```

*Note: You may need to create a `requirements.txt` file if it doesn't exist, listing the required Python packages (fastapi, uvicorn, python-dotenv, neo4j, ollama, requests, etc.).*

Update the Neo4j connection details in `backend/main.py` if your database credentials or URI are different.

Ensure your Ollama service is running and accessible from the backend, and verify the `ollama_client` host in `backend/main.py`.

Run the FastAPI backend server:

```bash
uvicorn main:app --reload
```

The backend should now be running at `http://127.0.0.1:8000`.

### 3. Set up the Frontend

Navigate to the `frontend` directory:

```bash
cd ../frontend
```

Install the frontend dependencies:

```bash
npm install
# or
yarn install
```

Run the React development server:

```bash
npm run dev
# or
yarn dev
```

The frontend should now be running, typically at `http://localhost:5173`.

## Features

*   Natural Language to Cypher Query Conversion
*   Interactive Knowledge Graph Visualization
*   Tabular display of query results
*   Detailed node property display on click
*   Responsive UI

## Contributing

(Optional section on how to contribute)

## License

(Optional section on project license)

## Acknowledgements

(Optional section for thanking contributors or data sources) 