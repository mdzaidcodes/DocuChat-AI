"use client";

import React, { useState, useEffect } from 'react';
import { FileText, Trash2, Plus, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDocuments, removeDocument, uploadDocument } from '@/lib/api';
import Swal from 'sweetalert2';

/**
 * Interface for document metadata
 */
interface Document {
  file_id: string;
  filename: string;
  chunks: number;
  pages: number;
}

/**
 * DocumentManager Component
 * Shows all uploaded documents with ability to add/remove
 * Simple and clean UI for document management
 */
export default function DocumentManager({ sessionId, onDocumentChange }: { sessionId: string | null, onDocumentChange: () => void }) {
  const [documents, setDocuments] = useState<Record<string, Document>>({});
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  /**
   * Load documents
   */
  const loadDocuments = async () => {
    try {
      const response = await getDocuments();
      setDocuments(response.documents || {});
    } catch (error) {
      console.error('Failed to load documents:', error);
    }
  };

  /**
   * Load on mount and when session changes
   */
  useEffect(() => {
    if (sessionId) {
      loadDocuments();
    } else {
      setDocuments({});
    }
  }, [sessionId]);

  /**
   * Handle file upload
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const hasDocuments = Object.keys(documents).length > 0;
      await uploadDocument(file, hasDocuments);
      await loadDocuments();
      onDocumentChange();
      
      Swal.fire({
        icon: 'success',
        title: 'Document Uploaded',
        text: `${file.name} has been added successfully!`,
        confirmButtonColor: '#3b82f6',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error: any) {
      console.error('Upload failed:', error);
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error.response?.data?.error || 'Failed to upload document',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  /**
   * Handle document deletion
   */
  const handleDelete = async (fileId: string, filename: string) => {
    const result = await Swal.fire({
      title: 'Delete Document?',
      text: `Remove "${filename}" from this chat?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await removeDocument(fileId);
        await loadDocuments();
        onDocumentChange();
        
        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Document removed successfully',
          confirmButtonColor: '#3b82f6',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Delete failed:', error);
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: 'Failed to remove document',
          confirmButtonColor: '#3b82f6',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const docList = Object.entries(documents);
  const docCount = docList.length;

  if (!sessionId) return null;

  return (
    <div className="bg-white rounded-xl border-2 border-blue-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 px-5 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 text-lg">Documents</h3>
              <p className="text-sm text-blue-700">{docCount} {docCount === 1 ? 'document' : 'documents'} loaded</p>
            </div>
          </div>
          
          {/* Upload Button */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf,.docx,.doc"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
            <Button
              disabled={uploading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
              asChild
            >
              <span>
                {uploading ? (
                  <>
                    <Upload className="h-4 w-4 mr-2 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Document
                  </>
                )}
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Document List */}
      <div className="p-4">
        {docCount === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-3 text-blue-300" />
            <p className="font-medium">No documents uploaded yet</p>
            <p className="text-sm mt-1">Click "Add Document" to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {docList.map(([fileId, doc]) => (
              <div
                key={fileId}
                className="flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-blue-50 border border-blue-100 rounded-lg hover:shadow-md transition-all group"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-800 truncate" title={doc.filename}>
                      {doc.filename}
                    </p>
                    <p className="text-xs text-slate-600">
                      {doc.pages} pages • {doc.chunks} chunks
                    </p>
                  </div>
                </div>
                
                <Button
                  onClick={() => handleDelete(fileId, doc.filename)}
                  variant="ghost"
                  size="icon"
                  disabled={loading}
                  className="flex-shrink-0 h-8 w-8 text-slate-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

