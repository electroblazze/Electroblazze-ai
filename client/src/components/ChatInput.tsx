import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ChatInputProps {
  message: string;
  setMessage: (message: string) => void;
  onSendMessage: () => void;
  isLoading: boolean;
  onSettingsClick: () => void;
}

const ChatInput = ({
  message,
  setMessage,
  onSendMessage,
  isLoading,
  onSettingsClick
}: ChatInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage();
    }
  };
  
  // Handle key press (Enter to send, Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (message.trim() && !isLoading) {
        onSendMessage();
      }
    }
  };
  
  return (
    <div className="border-t border-neutral-200 bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            disabled={isLoading}
            className="w-full px-4 py-3 pr-20 bg-neutral-100 border border-neutral-300 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl shadow-sm placeholder-neutral-500 transition-all outline-none"
          />
          <div className="absolute right-0 top-0 h-full flex items-center pr-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="p-2 text-neutral-500 hover:text-primary transition"
                  >
                    <i className="fas fa-paperclip"></i>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Attach files</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={`p-2 text-white bg-primary hover:bg-primary/90 rounded-lg transition ${
                !message.trim() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <i className="fas fa-paper-plane"></i>
              )}
            </Button>
          </div>
        </div>
        <div className="text-xs text-neutral-500 mt-2 flex items-center justify-between">
          <div>
            <span className="mr-4">
              <i className="fas fa-keyboard mr-1"></i> Press 
              <kbd className="px-1 py-0.5 bg-neutral-200 rounded text-xs mx-1">Enter</kbd> 
              to send
            </span>
            <span>
              <i className="fas fa-arrows-alt-v mr-1"></i> Press 
              <kbd className="px-1 py-0.5 bg-neutral-200 rounded text-xs mx-1">Shift</kbd>+
              <kbd className="px-1 py-0.5 bg-neutral-200 rounded text-xs mx-1">Enter</kbd> 
              for new line
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onSettingsClick}
            className="text-neutral-500 hover:text-primary transition"
          >
            <i className="fas fa-sliders-h"></i>
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
