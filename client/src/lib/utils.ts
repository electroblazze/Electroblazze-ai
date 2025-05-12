import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format message content with markdown-like formatting
export function formatMessageContent(content: string): string {
  // Replace newlines with <br>
  let formatted = content.replace(/\n/g, '<br>');
  
  // Simple formatting for bold, italic, code
  formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
  formatted = formatted.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>');
  
  // Handle lists (simple version)
  const lines = formatted.split('<br>');
  let inList = false;
  let listType = '';
  let formattedLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    // Ordered list
    if (lines[i].match(/^\d+\.\s/)) {
      if (!inList || listType !== 'ol') {
        if (inList) {
          formattedLines[formattedLines.length - 1] += listType === 'ol' ? '</ol>' : '</ul>';
        }
        formattedLines.push('<ol class="list-decimal ml-5 mt-2 space-y-1 text-gray-800">');
        inList = true;
        listType = 'ol';
      }
      formattedLines.push('<li>' + lines[i].replace(/^\d+\.\s/, '') + '</li>');
      
      // Check if next line is not a list item
      if (i === lines.length - 1 || !lines[i+1].match(/^\d+\.\s/)) {
        formattedLines.push('</ol>');
        inList = false;
      }
    }
    // Unordered list
    else if (lines[i].match(/^[-*]\s/)) {
      if (!inList || listType !== 'ul') {
        if (inList) {
          formattedLines[formattedLines.length - 1] += listType === 'ol' ? '</ol>' : '</ul>';
        }
        formattedLines.push('<ul class="list-disc ml-5 mt-2 space-y-1 text-gray-800">');
        inList = true;
        listType = 'ul';
      }
      formattedLines.push('<li>' + lines[i].replace(/^[-*]\s/, '') + '</li>');
      
      // Check if next line is not a list item
      if (i === lines.length - 1 || !lines[i+1].match(/^[-*]\s/)) {
        formattedLines.push('</ul>');
        inList = false;
      }
    }
    // Regular line
    else {
      if (inList) {
        // Close list if we were in one
        formattedLines.push(listType === 'ol' ? '</ol>' : '</ul>');
        inList = false;
      }
      formattedLines.push(lines[i]);
    }
  }
  
  return formattedLines.join('');
}
