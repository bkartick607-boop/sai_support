import React, { useEffect, useRef, useMemo } from 'react';
import { chatService } from '@/services/chatService';
import '@/styles/MessageContent.css';

interface MessageContentProps {
  content: string;
}

export const MessageContent: React.FC<MessageContentProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const processedContent = useMemo(() => {
    let result = content;

    result = result.replace(/<esc>([\s\S]*?)<\/esc>/gi, '$1');

    /*
     * Wrap ONLY tables inside a scroll container.
     * This keeps start/end text fixed while table body scrolls.
     */
    result = result.replace(
      /<table([\s\S]*?)<\/table>/gi,
      (match) => `<div class="chat-table-wrapper">${match}</div>`
    );

    return result;
  }, [content]);

  useEffect(() => {
    if (!containerRef.current) return;

    const copyButtons = containerRef.current.querySelectorAll('.copy-btn');
    copyButtons.forEach((btn) => {
      const button = btn as HTMLButtonElement;
      const onclickAttr = button.getAttribute('onclick') || '';
      const copyMatch = onclickAttr.match(/copyCode\('([^']*)'\)/);

      if (copyMatch) {
        const codeId = copyMatch[1];
        button.onclick = async (e) => {
          e.preventDefault();
          const codeElement = containerRef.current?.querySelector(
            `#${codeId} code`
          );
          if (codeElement) {
            try {
              await navigator.clipboard.writeText(codeElement.textContent || '');
              button.textContent = 'Copied!';
              button.classList.add('copied');
              setTimeout(() => {
                button.textContent = 'Copy';
                button.classList.remove('copied');
              }, 2000);
            } catch (error) {
              console.error('Copy failed:', error);
            }
          }
        };
      }
    });

    const links = containerRef.current.querySelectorAll('a[onclick]');
    links.forEach((link) => {
      const anchor = link as HTMLAnchorElement;
      const onclickAttr = anchor.getAttribute('onclick') || '';

      const sandboxMatch = onclickAttr.match(
        /downloadSandbox\('([^']*)',\s*'([^']*)'\)/
      );
      const blobMatch = onclickAttr.match(
        /downloadFile\('([^']*)',\s*'([^']*)'\)/
      );

      if (sandboxMatch) {
        const container = sandboxMatch[1].replace(/\\\\/g, '\\');
        const filename = sandboxMatch[2];

        anchor.onclick = async (e) => {
          e.preventDefault();
          await chatService.downloadSandboxFile(container, filename);
        };
      } else if (blobMatch) {
        const container = blobMatch[1];
        const filename = blobMatch[2];

        anchor.onclick = async (e) => {
          e.preventDefault();
          await chatService.downloadBlobFile(container, filename);
        };
      }
    });
  }, [processedContent]);

  return (
    <div
      ref={containerRef}
      className="message-content"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
};
