# DocuChat AI - Intelligent Document Q&A System

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-blue?style=flat&logo=flask)](https://flask.palletsprojects.com/)
[![Ollama](https://img.shields.io/badge/Ollama-llama3:8b-orange?style=flat)](https://ollama.ai/)
[![LangChain](https://img.shields.io/badge/LangChain-Latest-green?style=flat)](https://www.langchain.com/)

DocuChat AI is a sophisticated RAG (Retrieval-Augmented Generation) chatbot that enables users to upload documents and interact with them through intelligent semantic search. The system provides accurate, cited responses extracted directly from uploaded documents.

## Features

- **Document Upload**: Support for PDF and DOCX files (up to 50MB)
- **Intelligent Q&A**: Powered by Ollama's llama3:8b model running locally
- **Semantic Search**: Advanced vector embeddings using ChromaDB database
- **Source Citations**: Every answer includes citations with exact source locations (2-3 sentences with page numbers)
- **Multi-Document Support**: Add or remove documents from your knowledge base
- **Document Management**: Simple UI to view, add, and delete documents
- **Modern UI**: Beautiful blue-themed interface built with Next.js and shadcn/ui
- **Seamless Integration**: No CORS issues between frontend and backend
- **Privacy-Focused**: All data processing happens locally (ChromaDB for vector storage)

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Document   │  │     Chat     │  │    Citation     │   │
│  │    Upload    │  │  Interface   │  │     Viewer      │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API
┌──────────────────────────┴──────────────────────────────────┐
│                       Backend (Flask)                        │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐   │
│  │   Document   │  │   LangChain  │  │   Vector Store  │   │
│  │  Processing  │  │     RAG      │  │    (ChromaDB)   │   │
│  └──────────────┘  └──────────────┘  └─────────────────┘   │
│         │                  │                    │            │
│         └──────────────────┴────────────────────┘            │
│                            │                                 │
│                    ┌───────┴────────┐                       │
│                    │  Ollama (llama3:8b)  │                 │
│                    │  Local LLM Inference  │                │
│                    └──────────────────────┘                 │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS with blue theme
- **Icons**: Lucide React
- **Notifications**: SweetAlert2
- **HTTP Client**: Axios

### Backend
- **Framework**: Flask 3.0
- **LLM Framework**: LangChain
- **Vector Database**: ChromaDB (for semantic search and embeddings storage)
- **Document Processing**: PyPDF2, python-docx, unstructured
- **LLM**: Ollama (llama3:8b)
- **Embeddings**: Ollama (nomic-embed-text)

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js 18+** and npm
2. **Python 3.9+** and pip
3. **Ollama** - [Install from ollama.ai](https://ollama.ai/)

## Installation & Setup

### 1. Install Ollama and Pull Models

```bash
# Install Ollama from https://ollama.ai/

# Pull BOTH required models (don't skip the embedding model!)
ollama pull llama3:8b          # LLM for chat (~4.7GB)
ollama pull nomic-embed-text   # Embeddings for search (REQUIRED!)
```

**IMPORTANT**: Getting `"model nomic-embed-text not found"`? You need to pull it:
```bash
ollama pull nomic-embed-text
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the backend
python app.py
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a **new terminal** and:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the frontend
npm run dev
```

Frontend will run on `http://localhost:3000`

### 4. Access the Application

Open your browser and navigate to `http://localhost:3000`

## Usage Guide

### 1. Upload a Document
- Click on the upload area or drag and drop a PDF or DOCX file
- Wait for the document to be processed and indexed
- You'll see a success message with document details

### 2. Ask Questions
- Type your question in the chat input
- Press Enter or click the send button
- The AI will analyze your document and provide an answer

### 3. View Citations
- Each answer includes a "View Citations" button
- Click to see the exact sources from your document
- Citations show the page number and relevant text (2-3 sentences)

### 4. Manage Documents
- View all uploaded documents in the Document Manager
- Add more documents to expand the knowledge base
- Delete documents you no longer need

### 5. Clear Database
- Click "Clear Database" to remove all documents and start fresh
- Useful when switching to a different project

## UI/UX Features

- **Modern Blue Theme**: Professional and easy on the eyes
- **Drag & Drop Upload**: Intuitive document upload
- **Real-time Chat**: Smooth messaging experience with auto-scroll
- **Citation Preview**: Click to see exact sources
- **Document Manager**: Simple UI to manage your document collection
- **Responsive Design**: Works on all screen sizes
- **Loading States**: Clear feedback during processing

## Project Structure

```
DocuChat-AI/
├── backend/
│   ├── app.py                 # Flask application
│   ├── requirements.txt       # Python dependencies
│   ├── uploads/              # Uploaded documents (auto-created)
│   └── chroma_db/            # Vector database (auto-created)
├── frontend/
│   ├── app/
│   │   ├── page.tsx          # Landing page
│   │   ├── app/page.tsx      # Main application page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   ├── ui/               # shadcn components
│   │   ├── ChatInterface.tsx # Chat component
│   │   ├── DocumentUpload.tsx# Upload component
│   │   ├── DocumentManager.tsx# Document management
│   │   └── CitationDialog.tsx# Citation modal
│   ├── lib/
│   │   ├── api.ts            # API service
│   │   └── utils.ts          # Utilities
│   └── package.json
├── .gitignore
└── README.md
```

## Configuration

### Backend Configuration

Edit `backend/.env` (optional):

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3:8b
OLLAMA_EMBEDDING_MODEL=nomic-embed-text
MAX_FILE_SIZE_MB=50
```

### Frontend Configuration

Edit `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Troubleshooting

### Backend Issues

**Problem**: "Connection refused" errors
- **Solution**: Ensure Ollama is running: `ollama serve`

**Problem**: "Model not found"
- **Solution**: Pull the models: `ollama pull llama3:8b` and `ollama pull nomic-embed-text`

**Problem**: "Port 5000 already in use"
- **Solution**: Change the port in `app.py`: `app.run(port=5001)`

**Problem**: Word document upload fails
- **Solution**: Ensure all dependencies are installed: `pip install python-docx unstructured`

### Frontend Issues

**Problem**: Backend connection errors
- **Solution**: Ensure Flask backend is running on port 5000

**Problem**: CORS errors
- **Solution**: Check that `NEXT_PUBLIC_API_URL` in `.env.local` matches backend URL

**Problem**: Build errors
- **Solution**: Delete `node_modules` and `.next`, then run `npm install` again

## Deployment

### Backend Deployment

For production, use a WSGI server like Gunicorn:

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend Deployment

Build and deploy to platforms like Vercel:

```bash
npm run build
npm start
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Acknowledgments

- [Ollama](https://ollama.ai/) for local LLM inference
- [LangChain](https://www.langchain.com/) for RAG framework
- [ChromaDB](https://www.trychroma.com/) for vector database
- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Next.js](https://nextjs.org/) for the frontend framework
- [Flask](https://flask.palletsprojects.com/) for the backend framework

## Support

For issues and questions, please open an issue on GitHub.

---

Built with Next.js, Flask, Ollama, and LangChain
