import { useState, useRef, FormEvent, ChangeEvent, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  SendIcon, Sparkles, Cpu, Mic, ImagePlus, Wand2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
}

export default function MessageInput({ onSendMessage, isGenerating }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);

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
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="sticky bottom-0 z-10 bg-white/80 backdrop-blur-lg border-t border-gray-200 px-4 py-4">
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="relative">
          <div className={cn(
            "transition-all duration-300 ease-in-out rounded-2xl",
            "border shadow-sm",
            isFocused ? "border-primary/50 shadow-md ring-2 ring-primary/20" : "border-gray-200",
            isGenerating && "bg-gray-50/50 border-accent/30 ring-accent/20"
          )}>
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isGenerating ? "Nemotron is thinking..." : "Ask Nemotron Ultra anything..."}
              disabled={isGenerating}
              className={cn(
                "w-full px-5 py-3 pr-16 rounded-2xl focus:outline-none resize-none transition-colors",
                "border-0 focus:ring-0 shadow-none min-h-[56px]",
                isGenerating && "bg-transparent text-muted-foreground"
              )}
              rows={1}
            />
            
            {/* Action buttons */}
            <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100">
              <div className="flex space-x-1.5">
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 rounded-full text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                  disabled={isGenerating}
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 rounded-full text-muted-foreground hover:text-accent hover:bg-accent/10 transition-colors"
                  disabled={isGenerating}
                >
                  <ImagePlus className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="w-8 h-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  disabled={isGenerating}
                >
                  <Wand2 className="h-4 w-4" />
                </Button>
              </div>
              
              <Button
                type="submit"
                size="sm"
                disabled={!message.trim() || isGenerating}
                className={cn(
                  "rounded-full p-2 transition-all duration-300",
                  "bg-gradient-to-r from-primary to-secondary text-white",
                  "hover:shadow-md hover:brightness-110 disabled:opacity-50 disabled:hover:brightness-100",
                  "flex items-center justify-center"
                )}
              >
                {isGenerating ? (
                  <Cpu className="h-4 w-4 animate-spin" />
                ) : (
                  <SendIcon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </form>
        
        <div className="flex items-center justify-center mt-3 space-x-1 text-xs text-muted-foreground">
          <Sparkles className="h-3 w-3 text-accent" />
          <span>Powered by NVIDIA's Llama 3.1 Nemotron Ultra (253B) Advanced AI Model</span>
        </div>
      </div>
    </div>
  );
}
