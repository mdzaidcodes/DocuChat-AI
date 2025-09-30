"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { sendChatMessage, type ChatResponse, type Citation } from '@/lib/api';
import CitationDialog from './CitationDialog';
import Swal from 'sweetalert2';

/**
 * Interface for a chat message
 */
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

/**
 * Props for the ChatInterface component
 */
interface ChatInterfaceProps {
  isDocumentUploaded: boolean;
  sessionId: string | null;
}

/**
 * ChatInterface Component
 * Provides a chat interface for users to ask questions about their uploaded documents
 * Includes citation support and loading states
 * Works with session-based chat history
 */
export default function ChatInterface({ isDocumentUploaded, sessionId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCitations, setSelectedCitations] = useState<Citation[] | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Auto-scroll to bottom when new messages arrive
   */
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        // Smooth scroll to bottom
        setTimeout(() => {
          scrollElement.scrollTo({
            top: scrollElement.scrollHeight,
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  }, [messages]);

  /**
   * Focus input when document is uploaded
   */
  useEffect(() => {
    if (isDocumentUploaded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDocumentUploaded]);


  /**
   * Handle sending a message
   */
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Send question to the backend (no sessions, simple mode)
      const response: ChatResponse = await sendChatMessage(inputValue);

      // Create assistant message with citations
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.answer,
        citations: response.citations,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Chat error:', error);

      // Show error message
      Swal.fire({
        icon: 'error',
        title: 'Chat Error',
        text: error.response?.data?.error || 'An error occurred while processing your question.',
        confirmButtonColor: '#3b82f6',
      });

      // Remove the user message if there was an error
      setMessages((prev) => prev.filter((msg) => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle Enter key press
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  /**
   * Open citations dialog
   */
  const handleViewCitations = (citations: Citation[]) => {
    setSelectedCitations(citations);
  };

  return (
    <>
      <Card className="w-full h-[calc(100vh-12rem)] flex flex-col border-2 border-indigo-100 shadow-xl shadow-indigo-100/50">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-indigo-100 flex-shrink-0">
          <CardTitle className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">Chat with Your Document</span>
          </CardTitle>
          <CardDescription className="text-slate-600">
            {isDocumentUploaded
              ? 'Ask questions about your uploaded document'
              : 'Upload a document to start chatting'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">
          {/* Messages Area */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 pr-4 min-h-0">
            <div className="space-y-4">
              {messages.length === 0 && isDocumentUploaded && (
                <div className="text-center text-slate-500 py-12">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-4">
                    <Bot className="h-10 w-10 text-blue-600" />
                  </div>
                  <p className="text-base font-medium text-slate-700">No messages yet. Start by asking a question!</p>
                  <p className="text-sm mt-3 text-slate-500 max-w-md mx-auto">
                    Try: <span className="text-blue-600 font-medium">"What is this document about?"</span> or <span className="text-blue-600 font-medium">"Summarize the main points"</span>
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                        <Bot className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}

                  <div
                    className={`
                      max-w-[80%] rounded-2xl p-4
                      ${message.role === 'user'
                        ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                        : 'bg-gradient-to-br from-slate-50 to-blue-50 text-slate-900 border border-blue-100 shadow-md'
                      }
                    `}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {message.citations && message.citations.length > 0 && (
                      <Button
                        onClick={() => handleViewCitations(message.citations!)}
                        variant="outline"
                        size="sm"
                        className="mt-3 text-xs h-8 bg-white hover:bg-blue-50 border-blue-200 text-blue-700 font-medium"
                      >
                        <FileText className="h-3 w-3 mr-1.5" />
                        View {message.citations.length} Citation{message.citations.length > 1 ? 's' : ''}
                      </Button>
                    )}

                    <p className="text-xs opacity-70 mt-2 font-medium">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="flex-shrink-0">
                      <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="flex-shrink-0">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-blue-100 rounded-2xl p-4 shadow-md">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                      <p className="text-sm text-slate-700 font-medium">Thinking...</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input Area - Fixed at bottom */}
          <div className="flex gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100 flex-shrink-0">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isDocumentUploaded ? 'Ask a question...' : 'Upload a document first...'}
              disabled={!isDocumentUploaded || isLoading}
              className="
                flex-1 px-4 py-3 border-2 border-blue-200 rounded-xl bg-white
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                disabled:opacity-50 disabled:cursor-not-allowed
                text-sm placeholder:text-slate-400
              "
            />
            <Button
              onClick={handleSendMessage}
              disabled={!isDocumentUploaded || !inputValue.trim() || isLoading}
              size="icon"
              className="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Citations Dialog */}
      <CitationDialog
        citations={selectedCitations}
        onClose={() => setSelectedCitations(null)}
      />
    </>
  );
}
