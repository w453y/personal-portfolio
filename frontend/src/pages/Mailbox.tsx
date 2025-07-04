import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Send, 
  Search, 
  Filter, 
  RefreshCw, 
  MoreVertical,
  ArrowLeft,
  Copy,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  User,
  Calendar,
  Phone,
  Trash2,
  Moon,
  Sun
} from 'lucide-react';
import { toast } from 'sonner';
import { apiService } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  ip_address: string;
  user_agent: string;
  referrer: string;
}

interface ConversationHistory {
  timestamp: string;
  message: string;
  type: 'reply' | 'original';
}

interface ConversationMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  date: string;
  isOutgoing: boolean;
  source?: 'contact-form' | 'gmail';
}

interface Conversation {
  contactId: number;
  email: string;
  name: string;
  subject: string;
  isRead: boolean;
  lastActivity: string;
  messages: ConversationMessage[];
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const Mailbox: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [currentConversationData, setCurrentConversationData] = useState<Conversation | null>(null); // Full server conversation data
  const [viewMode, setViewMode] = useState<'legacy' | 'conversations'>('conversations'); // Default to conversations
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [replyText, setReplyText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({ total: 0, unread: 0, today: 0 });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authCredentials, setAuthCredentials] = useState({ username: '', password: '' });
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([]);
  const [gmailStatus, setGmailStatus] = useState({ configured: false, connected: false });
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode from localStorage
    const saved = localStorage.getItem('mailbox_dark_mode');
    const isDark = saved === 'true';
    if (isDark) {
      document.documentElement.classList.add('dark');
    }
    return isDark;
  });
  const [deleting, setDeleting] = useState<number | null>(null);

  // Helper function to make authenticated API requests
  const makeAuthRequest = async (endpoint: string, options: RequestInit = {}) => {
    const baseUrl = import.meta.env.DEV ? 'http://localhost:3001' : '';
    const url = `${baseUrl}${endpoint}`;
    
    // In development mode, skip authentication headers
    const headers = import.meta.env.DEV ? 
      { 'Content-Type': 'application/json', ...options.headers } :
      { ...getAuthHeaders(), ...options.headers };
    
    return fetch(url, {
      ...options,
      headers,
      // Add timeout to prevent hanging
      signal: AbortSignal.timeout(15000), // 15 second timeout
    });
  };

  // Authentication check
  useEffect(() => {
    const checkAuth = () => {
      // Skip authentication in development mode
      if (import.meta.env.DEV) {
        setIsAuthenticated(true);
        return true;
      }
      
      const stored = localStorage.getItem('mailbox_auth');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAuthCredentials(parsed);
          setIsAuthenticated(true);
          return true;
        } catch {
          localStorage.removeItem('mailbox_auth');
        }
      }
      return false;
    };

    if (checkAuth()) {
      loadMessages();
      loadConversations();
      checkGmailStatus();
    }
  }, []);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
      // Test authentication by making a request to the admin endpoint
      const basicAuth = btoa(`${username}:${password}`);
      const response = await makeAuthRequest('/api/admin', {
        headers: {
          'Authorization': `Basic ${basicAuth}`
        }
      });

      if (response.ok) {
        const credentials = { username, password };
        localStorage.setItem('mailbox_auth', JSON.stringify(credentials));
        setAuthCredentials(credentials);
        setIsAuthenticated(true);
        loadMessages();
        loadConversations();
        checkGmailStatus();
        toast.success('Authentication successful!');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Authentication failed');
    }
  };

  const getAuthHeaders = () => {
    const basicAuth = btoa(`${authCredentials.username}:${authCredentials.password}`);
    return {
      'Authorization': `Basic ${basicAuth}`,
      'Content-Type': 'application/json'
    };
  };

  const loadMessages = async (page = 1) => {
    try {
      setLoading(true);
      const response = await makeAuthRequest(`/api/contact?page=${page}&limit=50`);

      if (!response.ok) {
        // Only handle 401 as auth failure in production mode
        if (response.status === 401 && !import.meta.env.DEV) {
          setIsAuthenticated(false);
          localStorage.removeItem('mailbox_auth');
          return;
        }
        throw new Error('Failed to load messages');
      }

      const data: ApiResponse<ContactMessage[]> = await response.json();
      if (data.success && data.data) {
        setMessages(data.data);
        setCurrentPage(data.pagination?.page || 1);
        setTotalPages(data.pagination?.pages || 1);
        
        // Update stats
        const total = data.pagination?.total || 0;
        const unread = data.data.filter(msg => !msg.is_read).length;
        const today = data.data.filter(msg => 
          new Date(msg.created_at).toDateString() === new Date().toDateString()
        ).length;
        setStats({ total, unread, today });
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const response = await makeAuthRequest('/api/admin/conversations');

      if (!response.ok) {
        // Only handle 401 as auth failure in production mode
        if (response.status === 401 && !import.meta.env.DEV) {
          setIsAuthenticated(false);
          localStorage.removeItem('mailbox_auth');
          return;
        }
        throw new Error('Failed to load conversations');
      }

      const data = await response.json();
      if (data.success) {
        // Ensure messages within each conversation are sorted by date
        const sortedConversations = (data.conversations || []).map((conv: Conversation) => ({
          ...conv,
          messages: conv.messages.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        }));
        
        setConversations(sortedConversations);
        
        // Update stats based on conversations
        const total = data.totalConversations || 0;
        const unread = data.conversations?.filter((conv: Conversation) => !conv.isRead).length || 0;
        const today = data.conversations?.filter((conv: Conversation) => 
          new Date(conv.lastActivity).toDateString() === new Date().toDateString()
        ).length || 0;
        setStats({ total, unread, today });
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const checkGmailStatus = async () => {
    try {
      const response = await makeAuthRequest('/api/admin/gmail/status');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setGmailStatus({
            configured: data.configured,
            connected: data.connected
          });
        }
      }
    } catch (error) {
      console.error('Error checking Gmail status:', error);
    }
  };

  const selectMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    setSelectedConversation(null); // Clear conversation selection
    setCurrentConversationData(null); // Clear current conversation data
    
    // Mark as read if unread
    if (!message.is_read) {
      await markAsRead(message.id);
    }

    // Load conversation history
    loadConversationHistory(message.id);
  };

  const selectConversation = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setSelectedMessage(null); // Clear message selection
    setCurrentConversationData(conversation); // Use the conversation data directly
    
    // Mark as read if unread
    if (!conversation.isRead) {
      await markAsRead(conversation.contactId);
    }

    // Load conversation history for the original contact
    loadConversationHistory(conversation.contactId);
  };

  const markAsRead = async (messageId: number) => {
    try {
      const response = await makeAuthRequest(`/api/contact/${messageId}/read`, {
        method: 'PATCH'
      });

      if (response.ok) {
        // Update local state
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true } : msg
        ));
        
        if (selectedMessage?.id === messageId) {
          setSelectedMessage(prev => prev ? { ...prev, is_read: true } : null);
        }

        // Update stats
        setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1) }));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const sendReply = async () => {
    const messageId = selectedConversation?.contactId || selectedMessage?.id;
    if (!messageId || !replyText.trim()) {
      toast.error('Please enter a reply message');
      return;
    }

    setSending(true);
    try {
      const response = await makeAuthRequest(`/api/contact/${messageId}/reply`, {
        method: 'POST',
        body: JSON.stringify({ replyMessage: replyText })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Reply sent successfully!');
        
        // Clear reply text
        setReplyText('');
        
        // Reload conversation history to show the new reply
        await loadConversationHistory(messageId);
        
        // Mark as read and refresh data
        if (selectedConversation && !selectedConversation.isRead) {
          await markAsRead(selectedConversation.contactId);
          // Refresh conversations to show updated state
          loadConversations();
        } else if (selectedMessage && !selectedMessage.is_read) {
          await markAsRead(selectedMessage.id);
        }
      } else {
        toast.error(result.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      toast.error('Network error while sending reply');
    } finally {
      setSending(false);
    }
  };

  const loadConversationHistory = async (messageId: number) => {
    try {
      // Always fetch fresh data from the server instead of using localStorage
      const response = await makeAuthRequest(`/api/admin/conversations/${messageId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.conversation) {
          // Store the full conversation data for use in both views
          setCurrentConversationData(data.conversation);
          
          // Transform the conversation messages into the legacy format for backward compatibility
          const history: ConversationHistory[] = data.conversation.messages
            .filter((msg: any) => msg.type !== 'contact_form') // Exclude the original contact form
            .map((msg: any) => ({
              timestamp: msg.date,
              message: msg.content,
              type: msg.isOutgoing ? 'reply' : 'user_reply',
              sender: msg.sender,
              senderEmail: msg.senderEmail
            }));
          
          setConversationHistory(history);
          
          // Also update localStorage as backup, but always fetch fresh data
          localStorage.setItem(`conversation_${messageId}`, JSON.stringify(history));
        } else {
          // Fallback to localStorage if API fails
          setCurrentConversationData(null);
          const stored = localStorage.getItem(`conversation_${messageId}`);
          if (stored) {
            try {
              const history = JSON.parse(stored);
              setConversationHistory(history);
            } catch {
              setConversationHistory([]);
            }
          } else {
            setConversationHistory([]);
          }
        }
      } else {
        throw new Error('Failed to fetch conversation');
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
      
      // Fallback to localStorage if API fails
      setCurrentConversationData(null);
      const stored = localStorage.getItem(`conversation_${messageId}`);
      if (stored) {
        try {
          const history = JSON.parse(stored);
          setConversationHistory(history);
        } catch {
          setConversationHistory([]);
        }
      } else {
        setConversationHistory([]);
      }
    }
  };

  const addToConversationHistory = (messageId: number, replyMessage: string) => {
    const newEntry: ConversationHistory = {
      timestamp: new Date().toISOString(),
      message: replyMessage,
      type: 'reply'
    };

    const updated = [...conversationHistory, newEntry];
    setConversationHistory(updated);
    localStorage.setItem(`conversation_${messageId}`, JSON.stringify(updated));
  };

  const copyEmail = (email: string) => {
    navigator.clipboard.writeText(email).then(() => {
      toast.success(`Email copied: ${email}`);
    });
  };

  const exportMessage = () => {
    if (!selectedMessage) return;

    const exportData = {
      id: selectedMessage.id,
      name: selectedMessage.name,
      email: selectedMessage.email,
      phone: selectedMessage.phone,
      subject: selectedMessage.subject,
      message: selectedMessage.message,
      created_at: selectedMessage.created_at,
      is_read: selectedMessage.is_read,
      conversation_history: conversationHistory
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `message_${selectedMessage.id}_${selectedMessage.name.replace(/\s+/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    toast.success('Message exported successfully');
  };

  const deleteConversation = async (conversationId: number, isLegacy = false) => {
    if (!confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleting(conversationId);
      
      const endpoint = isLegacy 
        ? `/api/contact/${conversationId}` 
        : `/api/contact/${conversationId}`;
      
      const response = await makeAuthRequest(endpoint, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Conversation deleted successfully');
        
        // Refresh the data
        if (viewMode === 'conversations') {
          loadConversations();
          setSelectedConversation(null);
        } else {
          loadMessages();
          setSelectedMessage(null);
        }
        
        // Clear conversation history for this conversation
        const key = isLegacy ? `conversation_${conversationId}` : `conversation_${conversationId}`;
        localStorage.removeItem(key);
      } else {
        throw new Error('Failed to delete conversation');
      }
    } catch (error) {
      toast.error('Failed to delete conversation');
      console.error('Delete error:', error);
    } finally {
      setDeleting(null);
    }
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('mailbox_dark_mode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
  };

  const insertTemplate = () => {
    const templates = [
      "Thank you for your message! I'll get back to you soon.",
      "Hi there!\n\nThank you for reaching out. I'm interested in discussing this further.",
      "Hello!\n\nI appreciate you contacting me. Let's schedule a call to discuss this in detail.",
      "Thanks for your inquiry. I'd be happy to help you with this project."
    ];

    const choice = window.prompt(
      'Choose a template:\n\n' + 
      templates.map((t, i) => `${i + 1}. ${t.replace(/\n/g, ' ')}`).join('\n\n') + 
      `\n\nEnter number (1-${templates.length}):`
    );

    const index = parseInt(choice || '0') - 1;
    if (index >= 0 && index < templates.length) {
      setReplyText(templates[index] + '\n\nBest regards,\nAbdul Wasey');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 2) {
      return 'Yesterday ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays <= 7) {
      return date.toLocaleDateString([], { weekday: 'short' }) + ' ' + 
             date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const filteredMessages = messages.filter(message => {
    const matchesSearch = searchQuery === '' || 
      message.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'unread' && !message.is_read) ||
      (statusFilter === 'read' && message.is_read);

    return matchesSearch && matchesStatus;
  });

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = searchQuery === '' || 
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conversation.messages.some(msg => 
        msg.body.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'unread' && !conversation.isRead) ||
      (statusFilter === 'read' && conversation.isRead);

    return matchesSearch && matchesStatus;
  });

  const logout = () => {
    localStorage.removeItem('mailbox_auth');
    setIsAuthenticated(false);
    setSelectedMessage(null);
    setMessages([]);
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${
        darkMode 
          ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
          : 'bg-gradient-to-br from-blue-50 to-indigo-100'
      }`}>
        <div className="absolute top-4 right-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDarkMode}
            className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
        <Card className={`w-full max-w-md ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <CardHeader className="text-center">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              darkMode ? 'bg-blue-900/50' : 'bg-blue-100'
            }`}>
              <Mail className={`w-8 h-8 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            </div>
            <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
              Mailbox Access
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Enter your admin credentials to continue
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Username
                </label>
                <Input
                  name="username"
                  type="text"
                  required
                  placeholder="Enter username"
                  className={darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Password
                </label>
                <Input
                  name="password"
                  type="password"
                  required
                  placeholder="Enter password"
                  className={darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}
                />
              </div>
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Portfolio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'
    }`}>
      {/* Header */}
      <div className={`border-b px-6 py-4 backdrop-blur-sm ${
        darkMode 
          ? 'bg-gray-800/90 border-gray-700 shadow-2xl' 
          : 'bg-white/90 border-gray-200 shadow-lg'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className={darkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : ''}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Portfolio
            </Button>
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                ✉️ Mailbox
              </h1>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Manage your contact form messages
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDarkMode}
              className={`${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (viewMode === 'conversations') {
                  loadConversations();
                } else {
                  loadMessages(currentPage);
                }
              }}
              disabled={loading}
              className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className={darkMode ? 'text-gray-300 hover:bg-gray-700' : ''}
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <div className={`w-80 border-r flex flex-col transition-colors duration-300 ${
          darkMode 
            ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
            : 'bg-white/50 border-gray-200 backdrop-blur-sm'
        }`}>
          {/* Stats */}
          <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className={`text-center p-3 rounded-xl ${
                darkMode 
                  ? 'bg-blue-500/20 border border-blue-500/30' 
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  {stats.total}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total</div>
              </div>
              <div className={`text-center p-3 rounded-xl ${
                darkMode 
                  ? 'bg-red-500/20 border border-red-500/30' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className={`text-2xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                  {stats.unread}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Unread</div>
              </div>
              <div className={`text-center p-3 rounded-xl ${
                darkMode 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-green-50 border border-green-200'
              }`}>
                <div className={`text-2xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                  {stats.today}
                </div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Today</div>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className={`flex rounded-lg p-1 ${
              darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
            }`}>
              <button
                onClick={() => {
                  setViewMode('conversations');
                  setSelectedMessage(null);
                  setSelectedConversation(null);
                  loadConversations();
                }}
                className={`flex-1 px-3 py-1 text-xs rounded transition-colors ${
                  viewMode === 'conversations'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Conversations
              </button>
              <button
                onClick={() => {
                  setViewMode('legacy');
                  setSelectedMessage(null);
                  setSelectedConversation(null);
                  loadMessages();
                }}
                className={`flex-1 px-3 py-1 text-xs rounded transition-colors ${
                  viewMode === 'legacy'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Legacy
              </button>
            </div>
            
            {/* Gmail Status */}
            {gmailStatus.configured && (
              <div className="mt-2 text-xs">
                <span className={`inline-flex items-center px-2 py-1 rounded-full ${
                  gmailStatus.connected 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  Gmail: {gmailStatus.connected ? 'Connected' : 'Configured'}
                </span>
              </div>
            )}
          </div>

          {/* Filters */}
          <div className={`p-4 border-b space-y-3 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              <Input
                placeholder="Search messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-400' : ''}`}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className={`w-full p-2 border rounded-lg text-sm ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-200' 
                  : 'border-gray-300'
              }`}
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>

          {/* Message List */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2" />
                Loading {viewMode === 'conversations' ? 'conversations' : 'messages'}...
              </div>
            ) : (viewMode === 'conversations' ? filteredConversations : filteredMessages).length === 0 ? (
              <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No {viewMode === 'conversations' ? 'conversations' : 'messages'} found
              </div>
            ) : (
              <div className="p-2">
                {viewMode === 'conversations' 
                  ? filteredConversations.map((conversation) => (
                      <div
                        key={`conv-${conversation.contactId}`}
                        className={`p-3 rounded-lg transition-colors mb-2 group ${
                          selectedConversation?.contactId === conversation.contactId
                            ? `${darkMode ? 'bg-blue-900/30 border-blue-600' : 'bg-blue-50 border-blue-200'} border`
                            : `${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`
                        } ${!conversation.isRead ? `${darkMode ? 'bg-red-900/30 border-l-4 border-red-500' : 'bg-red-50 border-l-4 border-red-500'}` : ''}`}
                      >
                        <div 
                          onClick={() => selectConversation(conversation)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className={`font-medium truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {conversation.name}
                            </div>
                            <div className="flex items-center space-x-1">
                              {!conversation.isRead && (
                                <Badge variant="destructive" className="text-xs">
                                  NEW
                                </Badge>
                              )}
                              {conversation.messages.length > 1 && (
                                <Badge variant="secondary" className="text-xs">
                                  {conversation.messages.length} messages
                                </Badge>
                              )}
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatDate(conversation.lastActivity)}
                              </span>
                            </div>
                          </div>
                          <div className={`text-sm font-medium truncate mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {conversation.subject}
                          </div>
                          <div className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {conversation.messages[conversation.messages.length - 1]?.body.substring(0, 60)}...
                          </div>
                        </div>
                        <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conversation.contactId, false);
                            }}
                            disabled={deleting === conversation.contactId}
                            className={`h-6 px-2 text-xs ${darkMode ? 'border-gray-600 hover:bg-red-600/20 hover:border-red-500 text-gray-300' : 'hover:bg-red-50 hover:border-red-300 text-red-600'}`}
                          >
                            {deleting === conversation.contactId ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  : filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 rounded-lg transition-colors mb-2 group ${
                          selectedMessage?.id === message.id
                            ? `${darkMode ? 'bg-blue-900/30 border-blue-600' : 'bg-blue-50 border-blue-200'} border`
                            : `${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`
                        } ${!message.is_read ? `${darkMode ? 'bg-red-900/30 border-l-4 border-red-500' : 'bg-red-50 border-l-4 border-red-500'}` : ''}`}
                      >
                        <div 
                          onClick={() => selectMessage(message)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-start justify-between mb-1">
                            <div className={`font-medium truncate ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                              {message.name}
                            </div>
                            <div className="flex items-center space-x-1">
                              {!message.is_read && (
                                <Badge variant="destructive" className="text-xs">
                                  NEW
                                </Badge>
                              )}
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatDate(message.created_at)}
                              </span>
                            </div>
                          </div>
                          <div className={`text-sm font-medium truncate mb-1 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                            {message.subject}
                          </div>
                          <div className={`text-sm truncate ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {message.message.substring(0, 60)}...
                          </div>
                        </div>
                        <div className="flex justify-end mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(message.id, true);
                            }}
                            disabled={deleting === message.id}
                            className={`h-6 px-2 text-xs ${darkMode ? 'border-gray-600 hover:bg-red-600/20 hover:border-red-500 text-gray-300' : 'hover:bg-red-50 hover:border-red-300 text-red-600'}`}
                          >
                            {deleting === message.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <Trash2 className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                }
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className={`p-4 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex justify-center space-x-2">
                {currentPage > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadMessages(currentPage - 1)}
                    className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                  >
                    Previous
                  </Button>
                )}
                <span className={`flex items-center px-3 py-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Page {currentPage} of {totalPages}
                </span>
                {currentPage < totalPages && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => loadMessages(currentPage + 1)}
                    className={darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {(!selectedMessage && !selectedConversation) ? (
            <div className={`flex-1 flex items-center justify-center ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="text-center">
                <Mail className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
                <h3 className={`text-lg font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  Select a {viewMode === 'conversations' ? 'conversation' : 'message'} to view
                </h3>
                <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                  Choose a {viewMode === 'conversations' ? 'conversation' : 'message'} from the list to read and reply
                </p>
              </div>
            </div>
          ) : selectedConversation ? (
            <>
              {/* Conversation Header */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={darkMode ? 'bg-gray-700 text-gray-300' : ''}>
                        {selectedConversation.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h2 className={`text-base font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} truncate`}>
                        {selectedConversation.name}
                      </h2>
                      <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} truncate`}>
                        {selectedConversation.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyEmail(selectedConversation.email)}
                      className={`h-8 px-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadConversationHistory(selectedConversation.contactId)}
                      disabled={loading}
                      className={`h-8 px-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
                    >
                      <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const exportData = {
                          conversation: selectedConversation,
                          exported_at: new Date().toISOString()
                        };
                        const dataStr = JSON.stringify(exportData, null, 2);
                        const dataBlob = new Blob([dataStr], { type: 'application/json' });
                        const url = URL.createObjectURL(dataBlob);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = `conversation_${selectedConversation.contactId}_${selectedConversation.name.replace(/\s+/g, '_')}.json`;
                        link.click();
                        URL.revokeObjectURL(url);
                        toast.success('Conversation exported successfully');
                      }}
                      className={`h-8 px-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteConversation(selectedConversation.contactId, false)}
                      disabled={deleting === selectedConversation.contactId}
                      className={`h-8 px-2 ${darkMode ? 'border-gray-600 hover:bg-red-600/20 hover:border-red-500 text-gray-300' : 'hover:bg-red-50 hover:border-red-300 text-red-600'}`}
                    >
                      {deleting === selectedConversation.contactId ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} truncate`}>
                    {selectedConversation.subject}
                  </h3>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {selectedConversation.messages.length} message{selectedConversation.messages.length !== 1 ? 's' : ''} • 
                    Last activity: {formatDate(selectedConversation.lastActivity)}
                  </p>
                </div>
              </div>

              {/* Unified Conversation Thread */}
              <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${darkMode ? 'bg-gray-900' : ''}`}>
                {(() => {
                  // Use only the server-provided messages (which include Gmail + contact form)
                  // No need to merge with conversationHistory as the server provides the complete thread
                  const sortedMessages = selectedConversation.messages.sort((a, b) => 
                    new Date(a.date).getTime() - new Date(b.date).getTime()
                  );

                  return sortedMessages.map((message, index) => {
                    const isFirst = index === 0;
                    const isOutgoing = !!message.isOutgoing;
                    return (
                      <Card key={message.id} className={`${isOutgoing ? 'ml-8' : 'mr-8'} ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
                        <CardHeader className="pb-2 pt-3 px-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {isOutgoing ? 'You' : selectedConversation.name}
                              </span>
                              <Badge variant="secondary" className={`text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : ''}`}>
                                {isOutgoing
                                  ? 'Your Reply'
                                  : isFirst
                                    ? 'Contact Form'
                                    : 'User Reply'}
                              </Badge>
                            </div>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(message.date).toLocaleString()}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 px-4 pb-3">
                          <div className={`whitespace-pre-wrap text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            {message.body}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  });
                })()}
              </div>

              {/* Reply Section */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-3`}>
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={`text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : ''}`}>
                      You
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className={`resize-none border-0 shadow-none p-2 text-sm focus-visible:ring-1 ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-200 placeholder-gray-400 focus-visible:ring-gray-500' 
                          : 'bg-gray-50 focus-visible:ring-blue-500'
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={insertTemplate}
                        className={`h-7 px-2 text-xs ${darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800'}`}
                      >
                        Template
                      </Button>
                      <Button
                        onClick={() => {
                          if (selectedConversation) {
                            // Use the contact ID for sending reply
                            sendReply();
                          }
                        }}
                        disabled={sending || !replyText.trim()}
                        size="sm"
                        className={`h-7 px-3 text-xs ${sending ? 'opacity-50' : ''}`}
                      >
                        {sending ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3 mr-1" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : selectedMessage ? (
            <>
              {/* Message Header */}
              <div className="bg-white border-b border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarFallback>
                        {selectedMessage.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {selectedMessage.name}
                      </h2>
                      <p className="text-blue-600">{selectedMessage.email}</p>
                      {selectedMessage.phone && (
                        <p className="text-gray-600 text-sm flex items-center mt-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {selectedMessage.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyEmail(selectedMessage.email)}
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        Copy Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => loadConversationHistory(selectedMessage.id)}
                        disabled={loading}
                      >
                        <RefreshCw className={`w-3 h-3 mr-1 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={exportMessage}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedMessage.subject}
                </h3>
              </div>

              {/* Message Body & Unified Thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {(() => {
                  // Use server data if available, otherwise fall back to legacy approach
                  if (currentConversationData) {
                    // Sort all messages chronologically
                    const sortedMessages = currentConversationData.messages.sort((a, b) => 
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                    );

                    return sortedMessages.map((message, index) => (
                      <Card key={message.id} className={`${message.isOutgoing ? 'ml-8' : 'mr-8'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm`}>
                        <CardHeader className="pb-2 pt-3 px-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                {message.isOutgoing ? 'You' : selectedMessage.name}
                              </span>
                              <Badge variant="secondary" className={`text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : ''}`}>
                                {message.isOutgoing
                                  ? 'Your Reply'
                                  : 'Contact Form'}
                              </Badge>
                            </div>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(message.date).toLocaleString()}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 px-4 pb-3">
                          <div className={`whitespace-pre-wrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                            {message.body}
                          </div>
                        </CardContent>
                      </Card>
                    ));
                  } else {
                    // Legacy fallback - create unified message thread
                    const allMessages = [
                      // Original message
                      {
                        id: `message-${selectedMessage.id}`,
                        from: `${selectedMessage.name} <${selectedMessage.email}>`,
                        to: 'You',
                        subject: selectedMessage.subject,
                        body: selectedMessage.message,
                        date: selectedMessage.created_at,
                        isOutgoing: false,
                        source: 'contact-form'
                      },
                      // Local replies
                      ...conversationHistory.map(entry => ({
                        id: `local-${entry.timestamp}`,
                        from: 'You',
                        to: selectedMessage.email,
                        subject: `Re: ${selectedMessage.subject}`,
                        body: entry.message,
                        date: entry.timestamp,
                        isOutgoing: true,
                        source: 'local-reply'
                      }))
                    ];
                    // Sort chronologically
                    const sortedMessages = allMessages.sort((a, b) => 
                      new Date(a.date).getTime() - new Date(b.date).getTime()
                    );

                    return sortedMessages.map((message, index) => {
                      const isFirst = index === 0;
                      return (
                        <Card key={message.id} className={`${message.isOutgoing ? 'ml-8' : 'mr-8'} ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'} shadow-sm`}>
                          <CardHeader className="pb-2 pt-3 px-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <span className={`font-medium text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                                  {message.isOutgoing ? 'You' : selectedMessage.name}
                                </span>
                                <Badge variant="secondary" className={`text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : ''}`}>
                                  {message.isOutgoing
                                    ? 'Your Reply'
                                    : isFirst
                                      ? 'Contact Form'
                                      : 'User Reply'}
                                </Badge>
                              </div>
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {new Date(message.date).toLocaleString()}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 px-4 pb-3">
                            <div className={`whitespace-pre-wrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                              {message.body}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    });
                  }
                })()}
              </div>

              {/* Reply Section */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-3`}>
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={`text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : ''}`}>
                      You
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className={`resize-none border-0 shadow-none p-2 text-sm focus-visible:ring-1 ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-200 placeholder-gray-400 focus-visible:ring-gray-500' 
                          : 'bg-gray-50 focus-visible:ring-blue-500'
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={insertTemplate}
                        className={`h-7 px-2 text-xs ${darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800'}`}
                      >
                        Template
                      </Button>
                      <Button
                        onClick={sendReply}
                        disabled={sending || !replyText.trim()}
                        size="sm"
                        className={`h-7 px-3 text-xs ${sending ? 'opacity-50' : ''}`}
                      >
                        {sending ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3 mr-1" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : selectedMessage ? (
            <>
              {/* Legacy Message Detail View */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className={darkMode ? 'bg-gray-700 text-gray-300' : ''}>
                        {selectedMessage.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <h2 className={`text-base font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-900'} truncate`}>
                        {selectedMessage.name}
                      </h2>
                      <p className={`text-sm ${darkMode ? 'text-blue-400' : 'text-blue-600'} truncate`}>
                        {selectedMessage.email}
                      </p>
                      {selectedMessage.phone && (
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Phone className="w-3 h-3 inline mr-1" />
                          {selectedMessage.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyEmail(selectedMessage.email)}
                      className={`h-8 px-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={exportMessage}
                      className={`h-8 px-2 ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteConversation(selectedMessage.id, true)}
                      disabled={deleting === selectedMessage.id}
                      className={`h-8 px-2 ${darkMode ? 'border-gray-600 hover:bg-red-600/20 hover:border-red-500 text-gray-300' : 'hover:bg-red-50 hover:border-red-300 text-red-600'}`}
                    >
                      {deleting === selectedMessage.id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-100' : 'text-gray-900'} truncate`}>
                    {selectedMessage.subject}
                  </h3>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {formatDate(selectedMessage.created_at)}
                    {!selectedMessage.is_read && (
                      <Badge variant="destructive" className="ml-2 text-xs">NEW</Badge>
                    )}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div className={`flex-1 overflow-y-auto p-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <Card className={`${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-sm`}>
                  <CardHeader className="pb-2 pt-3 px-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className={`font-medium text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                          {selectedMessage.name}
                        </span>
                        <Badge variant="secondary" className={`text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : ''}`}>
                          Contact Form
                        </Badge>
                      </div>
                      <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(selectedMessage.created_at).toLocaleString()}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 px-4 pb-3">
                    <div className={`whitespace-pre-wrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                      {selectedMessage.message}
                    </div>
                  </CardContent>
                </Card>

                {/* Local Conversation History */}
                {conversationHistory.length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h4 className={`font-medium text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>Conversation History</h4>
                    {conversationHistory.map((entry, index) => (
                      <Card key={index} className={`ml-8 ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'} shadow-sm`}>
                        <CardHeader className="pb-2 pt-3 px-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className={`font-medium text-sm ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>You</span>
                              <Badge variant="secondary" className={`text-xs ${darkMode ? 'bg-gray-600 text-gray-300' : ''}`}>Your Reply</Badge>
                            </div>
                            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(entry.timestamp).toLocaleString()}</span>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0 px-4 pb-3">
                          <div className={`whitespace-pre-wrap text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{entry.message}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply Section for Legacy View */}
              <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t p-3`}>
                <div className="flex items-start space-x-3">
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className={`text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : ''}`}>
                      You
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Type your reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      rows={3}
                      className={`resize-none border-0 shadow-none p-2 text-sm focus-visible:ring-1 ${
                        darkMode 
                          ? 'bg-gray-700 text-gray-200 placeholder-gray-400 focus-visible:ring-gray-500' 
                          : 'bg-gray-50 focus-visible:ring-blue-500'
                      }`}
                    />
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={insertTemplate}
                        className={`h-7 px-2 text-xs ${darkMode ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800'}`}
                      >
                        Template
                      </Button>
                      <Button
                        onClick={sendReply}
                        disabled={sending || !replyText.trim()}
                        size="sm"
                        className={`h-7 px-3 text-xs ${sending ? 'opacity-50' : ''}`}
                      >
                        {sending ? (
                          <>
                            <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-3 h-3 mr-1" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Mailbox;
