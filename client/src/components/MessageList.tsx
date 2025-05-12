import { useEffect, useRef } from "react";
import { Message as MessageType } from "@/lib/types";
import Message from "@/components/Message";
import TypingIndicator from "@/components/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MessageListProps {
  messages: MessageType[];
  isGenerating: boolean;
}

export default function MessageList({ messages, isGenerating }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4 max-w-3xl mx-auto pb-20">
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        
        {isGenerating && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
