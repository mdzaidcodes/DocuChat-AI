"use client";

import React, { useState, useRef } from 'react';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { uploadDocument, type UploadResponse } from '@/lib/api';
import Swal from 'sweetalert2';

/**
 * Props for the DocumentUpload component
 */
interface DocumentUploadProps {
  onUploadSuccess: (data: UploadResponse) => void;
}

/**
 * DocumentUpload Component
 * Provides a drag-and-drop or click-to-upload interface for documents
 * Supports PDF and DOCX files
 */
export default function DocumentUpload({ onUploadSuccess }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Handle file selection and upload
   */
  const handleFileChange = async (file: File | null) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload a PDF or DOCX file only.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'File size must be less than 50MB.',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload the document to the backend
      const response = await uploadDocument(file);

      // Show success message
      Swal.fire({
        icon: 'success',
        title: 'Upload Successful!',
        html: `
          <p><strong>File:</strong> ${response.filename}</p>
          <p><strong>Pages:</strong> ${response.pages}</p>
          <p><strong>Chunks:</strong> ${response.chunks}</p>
        `,
        confirmButtonColor: '#3b82f6',
      });

      setUploadedFile(response.filename);
      onUploadSuccess(response);
    } catch (error: any) {
      console.error('Upload error:', error);
      
      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Upload Failed',
        text: error.response?.data?.error || 'An error occurred while uploading the file.',
        confirmButtonColor: '#3b82f6',
      });
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * Handle drag and drop events
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  /**
   * Trigger file input click
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full border-2 border-blue-100 shadow-xl shadow-blue-100/50">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <CardTitle className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Upload Document</span>
        </CardTitle>
        <CardDescription className="text-slate-600">
          Upload a PDF or DOCX file to start chatting with your document
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`
            border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
            transition-all duration-300 ease-in-out
            ${isDragging ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 scale-105 shadow-lg' : 'border-blue-200 hover:border-blue-400 bg-gradient-to-br from-slate-50 to-blue-50'}
            ${isUploading ? 'pointer-events-none opacity-60' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={(e) => handleFileChange(e.target.files?.[0] || null)}
            className="hidden"
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                Uploading and processing your document...
              </p>
              <p className="text-sm text-slate-600">
                This may take a moment
              </p>
            </div>
          ) : uploadedFile ? (
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <p className="text-base font-semibold text-slate-800">
                Document uploaded successfully!
              </p>
              <p className="text-sm text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg font-medium">
                {uploadedFile}
              </p>
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadedFile(null);
                }}
                variant="outline"
                size="sm"
                className="mt-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-medium"
              >
                Upload Another Document
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                <Upload className="h-10 w-10 text-blue-600" />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-800">
                  Drag and drop your document here
                </p>
                <p className="text-sm text-slate-600 mt-1.5">
                  or click to browse
                </p>
              </div>
              <p className="text-sm text-slate-500 mt-2 bg-blue-50 px-4 py-2 rounded-lg">
                Supported formats: <span className="font-semibold text-blue-700">PDF, DOCX</span> (Max 50MB)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
