<div align="center">

# Bengali Literature RAG System
## Bilingual Question Answering on Tagore's "অপরিচিতা" (Oporichita)

[![Python](https://img.shields.io/badge/Python-3.8+-red?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![React](https://img.shields.io/badge/React-18+-black?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-red?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-black?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev)

*Powered by Google Gemini and LangChain*

</div>

---

## Overview

A Retrieval-Augmented Generation (RAG) system for Rabindranath Tagore's short story **"অপরিচিতা"**. Ask questions in Bengali or English and get answers grounded in the story text, in the same language as the question.

### Key Features

<table>
<tr>
<td>

**📚 Story-Focused Analysis**  
Characters, events, themes and narrative of "অপরিচিতা"

**🔤 Bengali Text Cleaning**  
Unicode NFC normalization and repair of broken conjuncts from PDF extraction

**🤖 Grounded Answers**  
Gemini answers only from retrieved story passages

</td>
<td>

**💬 Bilingual Conversations**  
Bengali and English queries, with automatic language detection

**🎯 Character Deep-Dive**  
Anupam, Kalyani, Shambhunath Sen and others

**🧠 Short-Term Memory**  
Follow-up questions use the last few exchanges as context

</td>
</tr>
</table>

---

## How It Works

1. **Ingestion:** the story text is cleaned (Unicode NFC normalization, broken-conjunct repair, removal of zero-width characters), split into chunks and embedded with Google `text-embedding-004`.
2. **Indexing:** embeddings are stored in a persistent **ChromaDB** vector store.
3. **Retrieval:** each question is normalized the same way, then the top 8 chunks above a similarity threshold are retrieved through **LangChain**.
4. **Generation:** **Gemini 1.5 Flash** answers from the retrieved passages and replies in the language of the question. If the story does not contain the answer, it says so.
5. **Serving:** a **FastAPI** backend (`/chat`, `/health`, `/stats`) and a **React + Vite + Tailwind** frontend.

---

## Setup

### Prerequisites
> **Python 3.8+** • **Node.js 16+** • **Google API Key** ([Get Here](https://makersuite.google.com/app/apikey))

### Single Command Setup

```bash
./start-rag.sh
```

**What the script does:**
- Creates a Python virtual environment
- Installs Python and Node.js dependencies
- Sets up environment configuration
- Builds the vector database from the documents
- Starts the backend (port 8000) and frontend (port 5173)

### Usage
1. **Get API Key** from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. **Run** `./start-rag.sh` in the project root
3. **Add your API key** when the script prompts for it
4. **Open** http://localhost:5173 in your browser

Press `Ctrl+C` in the terminal to stop the servers.

---

## Project Structure

```
Bengali-Literature-RAG-System/
├── backend/                 # FastAPI backend
│   ├── main.py              # RAG pipeline and API
│   ├── requirements.txt     # Python dependencies
│   ├── documents/           # Story documents
│   └── chroma_db/           # Vector database
├── frontend/                # React frontend
│   ├── src/                 # UI components
│   └── package.json         # Node dependencies
├── start-rag.sh             # Setup and startup script
└── README.md
```

---

## Example Queries

<table>
<tr>
<td width="50%">

**Bengali**
```
অনুপম কেমন চরিত্রের মানুষ?
গল্পে যৌতুক নিয়ে কী ঘটেছিল?
কল্যাণীর বাবার নাম কী?
```

</td>
<td width="50%">

**English**
```
What kind of person is Anupam?
What happened about dowry in the story?
What is Kalyani's father's name?
```

</td>
</tr>
</table>

---

## Technology Stack

<div align="center">

| **Backend** | **Frontend** | **AI & Database** |
|:---:|:---:|:---:|
| ![FastAPI](https://img.shields.io/badge/FastAPI-red?style=flat&logo=fastapi&logoColor=white) | ![React](https://img.shields.io/badge/React-black?style=flat&logo=react&logoColor=white) | ![Gemini](https://img.shields.io/badge/Gemini_1.5_Flash-red?style=flat&logo=google&logoColor=white) |
| ![Python](https://img.shields.io/badge/Python_3.8+-black?style=flat&logo=python&logoColor=white) | ![Vite](https://img.shields.io/badge/Vite-red?style=flat&logo=vite&logoColor=white) | ![ChromaDB](https://img.shields.io/badge/ChromaDB-black?style=flat&logo=database&logoColor=white) |
| ![LangChain](https://img.shields.io/badge/LangChain-red?style=flat&logo=langchain&logoColor=white) | ![Tailwind](https://img.shields.io/badge/Tailwind-black?style=flat&logo=tailwindcss&logoColor=white) | ![Embeddings](https://img.shields.io/badge/text--embedding--004-red?style=flat&logo=google&logoColor=white) |

</div>

---

## Author

Built by **Animesh Bhattacharjee** as a technical assessment for 10 Minute School.

[![GitHub](https://img.shields.io/badge/GitHub-Animesh6096-black?style=flat&logo=github&logoColor=white)](https://github.com/Animesh6096)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Animesh_Bhattacharjee-red?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/animesh-bhattacharjee-jhalok)
