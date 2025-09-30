"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Sparkles, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import DocumentUpload from '@/components/DocumentUpload';
import ChatInterface from '@/components/ChatInterface';
import DocumentManager from '@/components/DocumentManager';
import { Button } from '@/components/ui/button';
import { clearDatabase, type UploadResponse } from '@/lib/api';
import Swal from 'sweetalert2';

/**
 * App Page Component
 * Main application page with sidebar and chat interface
 */
export default function AppPage() {
  const router = useRouter();
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  const [uploadedDocInfo, setUploadedDocInfo] = useState<UploadResponse | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  /**
   * Handle successful document upload
   */
  const handleUploadSuccess = (data: UploadResponse) => {
    setIsDocumentUploaded(true);
    setUploadedDocInfo(data);
    // Set a dummy session ID just to enable the UI
    setActiveSessionId('main');
  };


  /**
   * Handle clearing the database
   */
  const handleClearDatabase = async () => {
    const result = await Swal.fire({
      title: 'Clear Database?',
      text: 'This will remove all uploaded documents and chat history. This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, clear it!',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        await clearDatabase();
        setIsDocumentUploaded(false);
        setUploadedDocInfo(null);

        Swal.fire({
          icon: 'success',
          title: 'Database Cleared',
          text: 'All documents and chat history have been removed.',
          confirmButtonColor: '#3b82f6',
        });
      } catch (error: any) {
        console.error('Clear database error:', error);
        
        Swal.fire({
          icon: 'error',
          title: 'Clear Failed',
          text: error.response?.data?.error || 'An error occurred while clearing the database.',
          confirmButtonColor: '#3b82f6',
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-slate-50">
      {/* Header - Full Width */}
      <header className="border-b border-blue-100 bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/')}
                variant="ghost"
                size="sm"
                className="text-slate-600 hover:text-blue-600"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
              <div className="h-6 w-px bg-blue-200"></div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
                  DocuChat AI
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isDocumentUploaded && (
                <Button
                  onClick={handleClearDatabase}
                  variant="outline"
                  size="sm"
                  className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 font-medium"
                >
                  Clear Database
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="container mx-auto px-6 py-8 max-w-7xl">
            {/* Main Layout: Document Manager + Chat */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Left: Document Manager */}
              <div className="lg:col-span-1">
                <DocumentManager 
                  sessionId={activeSessionId}
                  onDocumentChange={() => {
                    // Document changed - could refresh if needed
                  }}
                />
                
                {/* Upload Initial Document if no session or no documents */}
                {(!activeSessionId || !isDocumentUploaded) && (
                  <div className="mt-6">
                    <DocumentUpload onUploadSuccess={handleUploadSuccess} />
                  </div>
                )}
              </div>

              {/* Right: Chat Interface - only show if document is uploaded */}
              {isDocumentUploaded && activeSessionId && (
                <div className="lg:col-span-2">
                  <ChatInterface 
                    isDocumentUploaded={isDocumentUploaded}
                    sessionId={activeSessionId}
                  />
                </div>
              )}
              
              {/* Empty state if no documents */}
              {!isDocumentUploaded && (
                <div className="lg:col-span-2 flex items-center justify-center">
                  <div className="text-center text-slate-500 py-20">
                    <FileText className="h-20 w-20 mx-auto mb-4 text-blue-300" />
                    <h3 className="text-xl font-semibold text-slate-700 mb-2">No Documents Yet</h3>
                    <p className="text-sm">Upload a document to start chatting with AI</p>
                  </div>
                </div>
              )}
            </div>
      </main>
    </div>
  );
}
