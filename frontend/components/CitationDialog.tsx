"use client";

import React from 'react';
import { FileText, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type Citation } from '@/lib/api';

/**
 * Props for the CitationDialog component
 */
interface CitationDialogProps {
  citations: Citation[] | null;
  onClose: () => void;
}

/**
 * CitationDialog Component
 * Displays source citations from the document in a modal dialog
 * Shows the exact content that was used to generate the AI's response
 */
export default function CitationDialog({ citations, onClose }: CitationDialogProps) {
  return (
    <Dialog open={!!citations} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] border-2 border-blue-100">
        <DialogHeader className="border-b border-blue-100 pb-4">
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Source Citations</span>
          </DialogTitle>
          <DialogDescription className="text-slate-600 text-base">
            Here are the sources from your document that were used to generate the response
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[550px] pr-4">
          <div className="space-y-5">
            {citations?.map((citation) => (
              <div
                key={citation.id}
                className="border-2 border-blue-100 rounded-2xl p-5 bg-gradient-to-br from-white to-blue-50 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
              >
                {/* Citation Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-sm font-bold shadow-md">
                      {citation.id}
                    </span>
                    <span className="text-base font-semibold text-slate-800">
                      {citation.source}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-lg">
                    Page {citation.page}
                  </span>
                </div>

                {/* Citation Content */}
                <div className="mt-3 p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                  <p className="text-sm text-slate-700 leading-relaxed italic">
                    "{citation.content}"
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
