# 🧬 Diabetes Knowledge Graph Explorer

<div align="center">

![Diabetes Knowledge Graph](https://img.shields.io/badge/Diabetes-Knowledge%20Graph-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.68.0-green)
![Neo4j](https://img.shields.io/badge/Neo4j-4.4.0-purple)
![Ollama](https://img.shields.io/badge/Ollama-gemma3:12b-orange)

*A powerful web application for exploring the complex relationships between biological entities in Type 2 Diabetes research*

</div>

## 📋 Overview

The Diabetes Knowledge Graph Explorer is an innovative web application that enables researchers, scientists, and healthcare professionals to explore and analyze the intricate relationships between various biological entities involved in Type 2 Diabetes. By leveraging natural language processing and graph visualization, users can easily navigate through complex biological networks and discover valuable insights.

### 🌟 Key Features

- **Natural Language Queries**: Ask questions in plain English and get instant results
- **Interactive Graph Visualization**: Explore relationships between genes, proteins, and diseases
- **Comprehensive Data Display**: View detailed information in both graph and table formats
- **Real-time Data Analysis**: Get instant insights from the knowledge graph
- **User-friendly Interface**: Intuitive design for easy navigation and exploration

## 🏗️ Architecture

The application is built using a modern tech stack:

### Frontend
- **React 18** with Vite for fast development and optimal performance
- **Tailwind CSS** for beautiful, responsive design
- **Sigma.js** for interactive graph visualization
- **Framer Motion** for smooth animations
- **Axios** for efficient API communication
- **React Router** for seamless navigation

### Backend
- **FastAPI** for high-performance API endpoints
- **Neo4j Python Driver** for graph database operations
- **Ollama** integration for natural language processing
- **Python 3.8+** for robust backend logic

### Database
- **Neo4j Graph Database** for storing and querying the knowledge graph

## 📚 Data Sources

Our knowledge graph integrates data from multiple authoritative biomedical databases:

| Category | Databases |
|----------|-----------|
| **Genomic Data** | NCBI, HUGO, miRTarBase |
| **Protein Data** | UniProt, AlphaFold, InterPro, PROSITE |
| **Disease Data** | OMIM, DisGeNET, T2Diacod |
| **Drug Data** | TTD, CTD |
| **Pathway Data** | KEGG, Rhea |
| **Ontology Data** | Gene Ontology |
| **Literature** | PubMed (2000-2025) |

## 🚀 Getting Started

### Prerequisites

- Python 3.8 or higher
- Node.js (LTS version)
- Neo4j Desktop/Server
- Ollama with gemma3:12b model
- Git

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone <repository_url>
   cd diabetes-knowledge-graph
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   # Linux/MacOS
   source venv/bin/activate
   
   pip install -r requirements.txt
   ```

3. **Configure Backend**
   - Update Neo4j connection details in `backend/main.py`:
     ```python
     NEO4J_URI = "bolt://localhost:7687"
     NEO4J_USER = "neo4j"
     NEO4J_PASSWORD = "your_password"
     DB_NAME = "diabeteskbnew"
     ```
   - Ensure Ollama service is running and accessible

4. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the Application**
   ```bash
   # Terminal 1 - Backend
   cd backend
   uvicorn main:app --reload
   
   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## 💡 Usage Guide

1. **Natural Language Queries**
   - Type your question in the search bar
   - Example: "Show me genes associated with insulin resistance"

2. **Graph Visualization**
   - Click on nodes to view detailed information
   - Drag nodes to rearrange the graph
   - Zoom in/out to explore relationships

3. **Data Analysis**
   - View tabular data for detailed analysis
   - Export results in CSV format
   - Explore node properties and relationships

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- All data providers and databases
- Open-source community
- Contributors and maintainers

---

<div align="center">
Made with ❤️ for advancing diabetes research
</div> 