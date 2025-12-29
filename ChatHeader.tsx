import React from 'react';
import {
  Button,
  Text,
  Tooltip,
} from '@fluentui/react-components';
import { Delete24Regular, ArrowSync24Regular } from '@fluentui/react-icons';
import { useChat } from '@/contexts/ChatContext';
import '@/styles/ChatHeader.css';

export const ChatHeader: React.FC = () => {
  const { clearChat, threadId, initializeChat } = useChat();

  return (
    <div className="chat-header">
      <div className="chat-header-left">
        <Text weight="semibold" size={400}>
          Segmentation Agent
        </Text>
        <span className="session-badge">Active Session</span>
      </div>

      <div className="chat-header-right">
        <Tooltip content="Refresh session" relationship="label">
          <Button
            appearance="subtle"
            icon={<ArrowSync24Regular />}
            onClick={() => initializeChat()}
            aria-label="Refresh session"
          />
        </Tooltip>

        <Tooltip content="Clear chat" relationship="label">
          <Button
            appearance="subtle"
            icon={<Delete24Regular />}
            onClick={clearChat}
            aria-label="Clear chat"
          />
        </Tooltip>
      </div>
    </div>
  );
};
