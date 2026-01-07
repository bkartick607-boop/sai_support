import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react';
import { useIsAuthenticated } from '@azure/msal-react';
import { ChatMessage } from '@/types';
import { chatService } from '@/services/chatService';

interface ChatContextType {
  // State
  messages: ChatMessage[];
  isLoading: boolean;
  isInitializing: boolean;
  error: string | null;
  currentTabId: string;
  threadId: string | null;
  welcomeMessage: string | null;
  isBackendUp: boolean;

  // Actions
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => Promise<void>;
  dismissError: () => void;
  initializeChat: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

/**
 * Generate a unique tab ID
 */
const generateTabId = (): string => {
  let tabId = sessionStorage.getItem('chatTabId');
  if (!tabId) {
    tabId = 'tab-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
    sessionStorage.setItem('chatTabId', tabId);
  }
  return tabId;
};

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
  const isAuthenticated = useIsAuthenticated();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [welcomeMessage, setWelcomeMessage] = useState<string | null>(null);
  const [currentTabId] = useState<string>(generateTabId);
  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  /**
   * Initialize chat session
   */
  const initializeChat = useCallback(async () => {
    if (!isAuthenticated) {
      console.log('Not authenticated, skipping chat initialization');
      return;
    }

    setIsInitializing(true);
    try {
      // Register the tab with the backend
      await chatService.registerTab(currentTabId);

      // Initialize thread if needed
      const response = await chatService.initThread(currentTabId);
      if (response.threadId) {
        setThreadId(response.threadId);
      }
      if (response.welcomeMessage) {
        setWelcomeMessage(response.welcomeMessage);
      }

      // Load existing history
      const history = await chatService.getHistory(currentTabId);
      if (history && history.length > 0) {
        setMessages(history);
      }

      setInitialized(true);
      setError(null);
    } catch (err: unknown) {
      console.error('Failed to initialize chat:', err);
      // Show appropriate error based on error type
      const axiosError = err as { response?: { status?: number }; code?: string; message?: string };
      
      if (axiosError.code === 'ERR_NETWORK' || axiosError.message?.includes('Network Error')) {
        setError('Unable to connect to backend server. Please ensure the API is running.');
      } else if (axiosError.response?.status === 401) {
        setError('Authentication failed. Please sign in again.');
      } else if (axiosError.response?.status === 403) {
        setError('Access denied. You do not have permission to use this application. Please contact your administrator to request access.');
      } else {
        setError('Failed to initialize chat session. Please try again.');
      }
    } finally {
      setIsInitializing(false);
    }
  }, [currentTabId, isAuthenticated, initialized]);

  /**
   * Send a message to the agent
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading) return;

      const userMessage: ChatMessage = {
        id: 'msg-' + Date.now(),
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      // Add user message
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      // Add loading placeholder for assistant
      const loadingId = 'loading-' + Date.now();
      setMessages((prev) => [
        ...prev,
        {
          id: loadingId,
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          isLoading: true,
        },
      ]);

      try {
        const response = await chatService.ask({
          question: content,
          tabId: currentTabId,
        });

        // Replace loading message with actual response
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === loadingId
              ? {
                  id: 'msg-' + Date.now(),
                  role: 'assistant',
                  content: response.answer,
                  timestamp: new Date(),
                  isLoading: false,
                }
              : msg
          )
        );

        if (response.threadId) {
          setThreadId(response.threadId);
        }
      } catch (err) {
        // Remove loading message on error
        setMessages((prev) => prev.filter((msg) => msg.id !== loadingId));
        
        // Show appropriate error based on error type
        const axiosError = err as { response?: { status?: number }; code?: string; message?: string };
        
        if (axiosError.code === 'ERR_NETWORK' || axiosError.message?.includes('Network Error')) {
          setError('Unable to connect to backend server. Please ensure the API is running.');
        } else if (axiosError.response?.status === 401) {
          setError('Authentication failed. Please sign in again.');
        } else if (axiosError.response?.status === 403) {
          setError('Access denied. You do not have permission to use this application.');
        } else {
          const errorMessage = err instanceof Error ? err.message : 'Failed to get response';
          setError(errorMessage);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [currentTabId, isLoading]
  );

  /**
   * Clear the chat history
   */
  const clearChat = useCallback(async () => {
    try {
      await chatService.clear(currentTabId);
      setMessages([]);
      setThreadId(null);
    } catch (err) {
      console.error('Failed to clear chat:', err);
    }
  }, [currentTabId]);

  /**
   * Dismiss error message
   */
  const dismissError = useCallback(() => {
    setError(null);
  }, []);

  // Initialize when authenticated
  useEffect(() => {
    if (isAuthenticated && !initialized) {
      initializeChat();
    }
  }, [isAuthenticated, initialized, initializeChat]);

  const isBackendUp =
    error !== 'Unable to connect to backend server. Please ensure the API is running.';

  const value: ChatContextType = {
    messages,
    isLoading,
    isInitializing,
    error,
    currentTabId,
    threadId,
    welcomeMessage,
    isBackendUp,
    sendMessage,
    clearChat,
    dismissError,
    initializeChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
