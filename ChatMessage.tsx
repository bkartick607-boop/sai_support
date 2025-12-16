import React from 'react';
import { Avatar, Spinner, Text, tokens } from '@fluentui/react-components';
import { Bot24Regular } from '@fluentui/react-icons';
import { ChatMessage as ChatMessageType } from '@/types';
import { MessageContent } from './MessageContent';
import { useAuth } from '@/contexts/AuthContext';
import '@/styles/ChatMessage.css';

interface ChatMessageProps {
  message: ChatMessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { user } = useAuth();
  const isUser = message.role === 'user';

  const formatTime = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  };

  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'assistant-message'}`}>
      <div className="message-avatar">
        {isUser ? (
          <Avatar
            name={user?.name || 'User'}
            initials={user?.initials}
            color="brand"
            size={32}
          />
        ) : (
          <Avatar
            icon={<Bot24Regular />}
            color="colorful"
            size={32}
            style={{ backgroundColor: tokens.colorBrandBackground }}
          />
        )}
      </div>

      <div className="message-content-wrapper">
        <div className="message-header">
          <Text weight="semibold" size={200}>
            {isUser ? user?.name || 'You' : 'AI Assistant'}
          </Text>
          <Text size={100} className="message-time">
            {formatTime(message.timestamp)}
          </Text>
        </div>

        <div className="message-bubble">
          <div className="message-bubble-inner">
            {message.isLoading ? (
              <div className="message-loading">
                <Spinner size="tiny" />
                <Text size={200}>Processing...</Text>
              </div>
            ) : (
              <MessageContent content={message.content} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
