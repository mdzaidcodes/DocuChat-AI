"use client";

import React, { useEffect, useState } from 'react';
import { MessageSquare, Plus, Edit2, Trash2, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getChatSessions, createNewSession, renameSession, deleteSession } from '@/lib/api';
import Swal from 'sweetalert2';

/**
 * Interface for a chat session
 */
interface ChatSession {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
  message_count: number;
}

/**
 * Props for ChatSidebar component
 */
interface ChatSidebarProps {
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  refreshTrigger?: number; // Optional prop to trigger refresh from parent
}

/**
 * ChatSidebar Component
 * Left sidebar showing all chat sessions
 * Similar to ChatGPT interface with collapse/expand functionality
 */
export default function ChatSidebar({ activeSessionId, onSelectSession, onNewChat, isCollapsed, onToggleCollapse, refreshTrigger }: ChatSidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  /**
   * Load all chat sessions
   */
  const loadSessions = async () => {
    setLoading(true);
    try {
      const response = await getChatSessions();
      setSessions(response.sessions || []);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Load sessions on mount and when refresh is triggered
   */
  useEffect(() => {
    loadSessions();
  }, [refreshTrigger]);

  /**
   * Handle creating new chat
   */
  const handleNewChat = async () => {
    try {
      console.log('Creating new chat session...');
      const response = await createNewSession();
      console.log('New session created:', response.session);
      
      // Reload sessions to show the new one
      await loadSessions();
      
      // Notify parent to switch to the new session
      const newSessionId = response.session.id;
      console.log('Switching to new session:', newSessionId);
      onSelectSession(newSessionId);
    } catch (error) {
      console.error('Failed to create new chat:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Create Chat',
        text: 'Could not create a new chat session.',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  /**
   * Start editing a session name
   */
  const startEditing = (session: ChatSession) => {
    setEditingId(session.id);
    setEditName(session.name);
  };

  /**
   * Cancel editing
   */
  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
  };

  /**
   * Save renamed session
   */
  const saveRename = async (sessionId: string) => {
    if (!editName.trim()) {
      cancelEditing();
      return;
    }

    try {
      console.log('Renaming session:', sessionId, 'to:', editName.trim());
      await renameSession(sessionId, editName.trim());
      await loadSessions();
      cancelEditing();
    } catch (error) {
      console.error('Failed to rename session:', error);
      Swal.fire({
        icon: 'error',
        title: 'Failed to Rename',
        text: 'Could not rename the chat.',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  /**
   * Handle deleting a session
   */
  const handleDelete = async (session: ChatSession) => {
    const result = await Swal.fire({
      title: 'Delete Chat?',
      text: `"${session.name}" will be permanently deleted.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    });

    if (result.isConfirmed) {
      try {
        console.log('Deleting session:', session.id);
        await deleteSession(session.id);
        await loadSessions();
        
        // If deleted session was active, clear selection
        if (session.id === activeSessionId) {
          console.log('Deleted active session, clearing...');
          onNewChat();
        }

        Swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Chat deleted successfully.',
          confirmButtonColor: '#3b82f6',
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (error) {
        console.error('Failed to delete session:', error);
        Swal.fire({
          icon: 'error',
          title: 'Failed to Delete',
          text: 'Could not delete the chat.',
          confirmButtonColor: '#3b82f6',
        });
      }
    }
  };

  /**
   * Format date for display
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col h-full transition-all duration-300`}>
      {/* Header */}
      <div className="p-3 border-b border-slate-700 flex flex-col gap-2">
        {isCollapsed ? (
          // Collapsed: Show icon buttons stacked
          <>
            <Button
              onClick={handleNewChat}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg h-9"
              size="icon"
              title="New Chat"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              onClick={onToggleCollapse}
              variant="ghost"
              size="icon"
              className="w-full h-9 text-slate-400 hover:text-white hover:bg-slate-700"
              title="Expand Sidebar"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        ) : (
          // Expanded: Show buttons side by side
          <div className="flex items-center gap-2">
            <Button
              onClick={handleNewChat}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg text-sm h-9"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Chat
            </Button>
            <Button
              onClick={onToggleCollapse}
              variant="ghost"
              size="icon"
              className="flex-shrink-0 h-9 text-slate-400 hover:text-white hover:bg-slate-700"
              title="Collapse Sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 px-2 py-3">
        {isCollapsed ? (
          // Collapsed View - Show Icons Only
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => {
                  console.log('Clicked session (collapsed):', session.id, session.name);
                  onSelectSession(session.id);
                }}
                className={`
                  p-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center
                  ${activeSessionId === session.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                    : 'hover:bg-slate-700/50'
                  }
                `}
                title={session.name}
              >
                <MessageSquare className="h-5 w-5 text-white" />
              </div>
            ))}
          </div>
        ) : (
          // Expanded View - Full Details
          <>
            {loading ? (
              <div className="text-slate-400 text-sm text-center py-4">Loading...</div>
            ) : sessions.length === 0 ? (
              <div className="text-slate-400 text-sm text-center py-8 px-4">
                <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No chats yet</p>
                <p className="text-xs mt-1">Start a new chat!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    className={`
                      group relative rounded-lg transition-all duration-200
                      ${activeSessionId === session.id
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg'
                        : 'hover:bg-slate-700/50'
                      }
                    `}
                  >
                    {editingId === session.id ? (
                      // Edit Mode
                      <div className="p-2 flex items-center gap-1">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRename(session.id);
                            if (e.key === 'Escape') cancelEditing();
                          }}
                          className="flex-1 bg-slate-800 text-white text-xs px-2 py-1 rounded border border-slate-600 focus:outline-none focus:border-blue-500 min-w-0"
                          autoFocus
                        />
                        <button
                          onClick={() => saveRename(session.id)}
                          className="text-green-400 hover:text-green-300 flex-shrink-0"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="text-red-400 hover:text-red-300 flex-shrink-0"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      // Normal Mode
                      <div
                        onClick={() => {
                          console.log('Clicked session (expanded):', session.id, session.name);
                          onSelectSession(session.id);
                        }}
                        className="p-2.5 cursor-pointer flex items-start gap-2"
                      >
                        <div className="flex-1 min-w-0 overflow-hidden pr-1">
                          <p className="text-sm font-medium text-white truncate block" title={session.name}>
                            {session.name}
                          </p>
                          <p className="text-xs text-slate-300 mt-0.5 truncate block">
                            {formatDate(session.updated_at)}
                          </p>
                        </div>
                        
                        {/* Action Buttons (show on hover) */}
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(session);
                            }}
                            className="p-1 hover:bg-slate-600 rounded text-slate-300 hover:text-white"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(session);
                            }}
                            className="p-1 hover:bg-red-500 rounded text-slate-300 hover:text-white"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </ScrollArea>

      {/* Footer Info */}
      {!isCollapsed && (
        <div className="p-3 border-t border-slate-700 text-xs text-slate-400 text-center">
          {sessions.length} {sessions.length === 1 ? 'chat' : 'chats'}
        </div>
      )}
    </div>
  );
}
