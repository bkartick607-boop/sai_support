import React, { useState, useRef, useEffect } from 'react';
import { Button, Tooltip } from '@fluentui/react-components';
import { Send24Regular } from '@fluentui/react-icons';
import { useChat } from '@/contexts/ChatContext';
import '@/styles/ChatInput.css';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isLoading } = useChat();
  const inputRef = useRef<HTMLDivElement>(null);

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await sendMessage(message);

    if (inputRef.current) {
      inputRef.current.innerText = '';
      inputRef.current.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input">
      <div
        ref={inputRef}
        className="chat-textarea bottom-input"
        contentEditable={!isLoading}
        data-placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
        onInput={(e) =>
          setInput((e.target as HTMLDivElement).innerText)
        }
        onKeyDown={handleKeyDown}
        suppressContentEditableWarning
      />
      <Tooltip content="Send message (Enter)" relationship="label">
        <Button
          appearance="primary"
          icon={<Send24Regular />}
          onClick={handleSubmit}
          disabled={!input.trim() || isLoading}
          className="send-button"
        >
          Send
        </Button>
      </Tooltip>
    </div>
  );
};
