import { useState, useRef, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { SendIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
}

export default function MessageInput({ onSendMessage, isGenerating }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isGenerating) {
      onSendMessage(message);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Message Nemotron Ultra..."
            disabled={isGenerating}
            className={cn(
              "w-full px-4 py-3 pr-16 border border-gray-300 rounded-xl focus:outline-none resize-none",
              "focus:ring-2 focus:ring-primary focus:border-transparent",
              isGenerating && "bg-gray-100"
            )}
            rows={1}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isGenerating}
            className="absolute right-3 bottom-3 p-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50"
          >
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
        <div className="text-xs text-gray-500 mt-2 text-center">
          Powered by NVIDIA's Llama 3.1 Nemotron Ultra (253B)
        </div>
      </div>
    </div>
  );
}
