"use client";

import React from 'react';
import { ArrowRight, Sparkles, Github } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

/**
 * Landing Page Component
 * Displays features and a "Try Now" button to access the main app
 */
export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50">
      {/* Header */}
      <header className="border-b border-blue-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 bg-clip-text text-transparent">
                  DocuChat AI
                </h1>
                <p className="text-sm text-slate-600 font-medium">Intelligent Document Analysis</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6">
        <div className="py-8 text-center">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4">
            Chat with Your Documents
          </h2>
          <p className="text-slate-600 max-w-3xl mx-auto text-lg leading-relaxed mb-8">
            Transform any PDF or Word document into an interactive knowledge base. Ask questions and get instant, accurate answers with precise citations—all powered by advanced AI running completely on your machine for maximum privacy.
          </p>
        </div>

        {/* Features Section */}
        <div className="pb-8">
          <div className="grid md:grid-cols-3 gap-5 max-w-6xl mx-auto">
            <div className="text-center p-8 bg-white rounded-3xl border-2 border-blue-100 shadow-xl shadow-blue-100/50 hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-300 hover:-translate-y-2">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Document Upload</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Upload PDF or Word documents up to 50MB with intuitive drag & drop support
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-3xl border-2 border-indigo-100 shadow-xl shadow-indigo-100/50 hover:shadow-2xl hover:shadow-indigo-200/50 transition-all duration-300 hover:-translate-y-2">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Semantic Search</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Advanced vector embeddings with Chroma database for intelligent retrieval
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-3xl border-2 border-sky-100 shadow-xl shadow-sky-100/50 hover:shadow-2xl hover:shadow-sky-200/50 transition-all duration-300 hover:-translate-y-2">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-sky-500/30">
                <svg
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-bold text-slate-900 mb-3 text-lg">Cited Responses</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Every answer includes precise source citations with page numbers from your document
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center pb-12 pt-6">
          <Button
            onClick={() => router.push('/app')}
            size="lg"
            className="h-16 px-12 text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-2xl shadow-blue-500/50 hover:shadow-blue-600/60 transition-all duration-300 hover:scale-105 rounded-2xl"
          >
            Try Now
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-blue-100 bg-gradient-to-r from-white to-blue-50/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-600">
            <p className="font-medium">
              Built with <span className="text-blue-600">Next.js</span>, <span className="text-blue-600">Flask</span>, <span className="text-blue-600">Ollama</span> (llama3:8b), <span className="text-blue-600">Chroma</span>, and <span className="text-blue-600">LangChain</span>
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-blue-600 transition-colors font-medium"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
