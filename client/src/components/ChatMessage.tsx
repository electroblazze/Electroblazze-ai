import { useState } from "react";
import { format } from "date-fns";
import type { Message } from "@shared/schema";
import { Button } from "@/components/ui/button";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  
  // Check if the message contains code blocks
  const containsCodeBlock = message.content.includes("```");
  
  // Format the message content to handle code blocks and markdown
  const formatMessageContent = (content: string) => {
    if (!containsCodeBlock) {
      return <p className="whitespace-pre-wrap">{content}</p>;
    }
    
    // Split content by code blocks
    const parts = content.split(/(```(?:[\w-]+)?\n[\s\S]*?\n```)/g);
    
    return (
      <>
        {parts.map((part, index) => {
          // Check if this part is a code block
          if (part.startsWith("```") && part.endsWith("```")) {
            // Extract language if specified
            const langMatch = part.match(/```([\w-]+)?\n/);
            const language = langMatch && langMatch[1] ? langMatch[1] : "";
            
            // Extract code (remove the opening and closing ```)
            const code = part.replace(/```(?:[\w-]+)?\n/, "").replace(/\n```$/, "");
            
            return (
              <div key={index} className="bg-neutral-800 p-3 rounded-lg my-4 overflow-x-auto">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs text-neutral-400 uppercase">{language || "Code"}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-neutral-400 hover:text-white text-xs p-1"
                    onClick={() => {
                      navigator.clipboard.writeText(code);
                    }}
                  >
                    <i className="fas fa-copy mr-1"></i> Copy
                  </Button>
                </div>
                <pre className="text-neutral-100 text-sm font-mono whitespace-pre-wrap overflow-x-auto">
                  {code}
                </pre>
              </div>
            );
          } else {
            // Regular text
            return <p key={index} className="whitespace-pre-wrap">{part}</p>;
          }
        })}
      </>
    );
  };
  
  if (message.role === "user") {
    return (
      <div className="flex items-start justify-end">
        <div className="mr-3 bg-primary p-4 rounded-xl rounded-tr-sm shadow-sm max-w-[90%]">
          <p className="text-white whitespace-pre-wrap">{message.content}</p>
          <div className="mt-1 text-right">
            <span className="text-xs text-primary-foreground/70">
              {format(new Date(message.timestamp), 'h:mm a')}
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
          <i className="fas fa-user text-neutral-600"></i>
        </div>
      </div>
    );
  } else if (message.role === "assistant") {
    return (
      <div className="flex items-start">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white">
          <i className="fas fa-robot"></i>
        </div>
        <div className="ml-3 bg-white p-4 rounded-xl rounded-tl-sm shadow-sm flex-1">
          <div className="text-neutral-800">
            {formatMessageContent(message.content)}
          </div>
          <div className="mt-1">
            <span className="text-xs text-neutral-500">
              {format(new Date(message.timestamp), 'h:mm a')}
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    // For system messages (usually not displayed)
    return null;
  }
};

export default ChatMessage;
