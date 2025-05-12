import { BrainCircuit, Sparkles } from "lucide-react";

export default function TypingIndicator() {
  return (
    <div className="flex items-start space-x-4 max-w-3xl mx-auto mb-6 animate-fade-in">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary shadow-md flex items-center justify-center border-2 border-white">
        <BrainCircuit className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <div className="ai-message rounded-2xl rounded-tl-sm px-6 py-4 shadow-md relative bg-white/90">
          <div className="flex items-center justify-start h-4">
            <div className="h-2.5 w-2.5 bg-primary/60 rounded-full animate-typing-dot-1"></div>
            <div className="h-2.5 w-2.5 bg-primary/70 rounded-full mx-1.5 animate-typing-dot-2"></div>
            <div className="h-2.5 w-2.5 bg-primary/80 rounded-full animate-typing-dot-3"></div>
          </div>
          <div className="absolute -top-2.5 -left-2.5">
            <Sparkles className="h-5 w-5 text-accent animate-pulse opacity-80" />
          </div>
        </div>
        <div className="flex items-center mt-2 ml-2 space-x-1.5">
          <span className="text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">Abhimanyu AI</span>
          <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
          <span className="text-xs text-muted-foreground">Thinking...</span>
        </div>
      </div>
    </div>
  );
}
