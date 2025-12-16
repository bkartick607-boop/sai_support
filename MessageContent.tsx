import React, { useEffect, useRef, useMemo } from 'react';
import { chatService } from '@/services/chatService';
import '@/styles/MessageContent.css';

interface MessageContentProps {
  content: string;
}

/**
 * Render server-formatted HTML content with download link handling
 * The backend uses <esc>...</esc> tags to mark content that should be rendered as-is
 */
export const MessageContent: React.FC<MessageContentProps> = ({ content }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Process the content to handle <esc> tags
  const processedContent = useMemo(() => {
    let result = content;

    // Extract <esc> blocks and replace with their content
    result = result.replace(/<esc>([\s\S]*?)<\/esc>/gi, '$1');

    return result;
  }, [content]);

  // Attach click handlers for download links and copy buttons after render
  useEffect(() => {
    if (!containerRef.current) return;

    // Handle copy buttons for code blocks
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
              await navigator.clipboard.writeText(
                codeElement.textContent || ''
              );
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

    // Handle download links
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
          try {
            await chatService.downloadSandboxFile(container, filename);
          } catch (error) {
            console.error('Sandbox download failed:', error);
          }
        };
      } else if (blobMatch) {
        const container = blobMatch[1];
        const filename = blobMatch[2];

        anchor.onclick = async (e) => {
          e.preventDefault();
          try {
            await chatService.downloadBlobFile(container, filename);
          } catch (error) {
            console.error('Blob download failed:', error);
          }
        };
      }
    });
  }, [processedContent]);

  return (
    <div ref={containerRef} className="message-content">
      {/* Scroll + width constraint wrapper */}
      <div
        className="chat-table-wrapper"
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    </div>
  );
};
