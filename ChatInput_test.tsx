import React, { useState, useRef, useEffect } from 'react';
import { Button, Tooltip } from '@fluentui/react-components';
import { Send24Regular } from '@fluentui/react-icons';
import { useChat } from '@/contexts/ChatContext';
import '@/styles/ChatInput.css';

export const ChatInput: React.FC = () => {
  const [input, setInput] = useState('');
  const { sendMessage, isLoading } = useChat();
  const editorRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const focusCaretBottom = () => {
    const line = lineRef.current;
    if (!line) return;

    if (line.innerHTML === '') {
      line.innerHTML = '\u200B'; // zero-width space
    }

    const range = document.createRange();
    const sel = window.getSelection();

    range.selectNodeContents(line);
    range.collapse(false);
    sel?.removeAllRanges();
    sel?.addRange(range);
  };

  useEffect(() => {
    focusCaretBottom();
    lineRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const message = input;
    setInput('');
    await sendMessage(message);

    if (lineRef.current) {
      lineRef.current.innerHTML = '\u200B';
      editorRef.current!.dataset.empty = 'true';
      focusCaretBottom();
    }
  };

  const handleInput = () => {
    const text = lineRef.current?.innerText.replace(/\u200B/g, '') ?? '';
    setInput(text);
    editorRef.current!.dataset.empty = text ? 'false' : 'true';
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
        ref={editorRef}
        className="chat-textarea bottom-input"
        data-placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
        data-empty="true"
      >
        <div
          ref={lineRef}
          className="editor-line"
          contentEditable={!isLoading}
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          suppressContentEditableWarning
        />
      </div>

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
