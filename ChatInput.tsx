import React, { useState, useRef, useEffect } from 'react';
import { Button, Textarea, Tooltip } from '@fluentui/react-components';
import { Send24Regular } from '@fluentui/react-icons';
import { useChat } from '@/contexts/ChatContext';
import '@/styles/ChatInput.css';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isLoading } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [input]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await sendMessage(message);

    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-input">
      <Textarea
        ref={textareaRef}
        placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
        value={input}
        onChange={(_, data) => setInput(data.value)}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
        resize="vertical"
        className="chat-textarea"
        rows={2}
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
