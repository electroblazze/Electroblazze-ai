import { Message as MessageType } from "@/lib/types";
import { formatMessageContent } from "@/lib/utils";
import { User, BrainCircuit, Sparkles } from "lucide-react";

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  if (message.role === "system") return null;

  return (
    <div
      className={`animate-slide-up flex items-start space-x-4 max-w-3xl mx-auto mb-6 ${
        message.role === "user" ? "justify-end" : ""
      }`}
    >
      {message.role === "user" ? (
        <>
          <div className="flex-1 text-right">
            <div className="user-message rounded-2xl rounded-tr-sm px-5 py-3.5 shadow-md inline-block transition-all hover:shadow-lg">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: formatMessageContent(message.content) 
                }} 
              />
            </div>
            <div className="flex items-center justify-end mt-2 mr-2 space-x-1">
              <span className="text-xs text-muted-foreground">You</span>
              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
          </div>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-secondary/80 to-secondary shadow-md flex items-center justify-center border-2 border-white">
            <User className="h-5 w-5 text-white" />
          </div>
        </>
      ) : (
        <>
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary shadow-md glow-effect flex items-center justify-center border-2 border-white">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="ai-message rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-md relative transition-all hover:shadow-lg">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: formatMessageContent(message.content) 
                }} 
              />
              <div className="absolute -top-3 -left-3">
                <Sparkles className="h-5 w-5 text-accent animate-pulse opacity-70" />
              </div>
            </div>
            <div className="flex items-center mt-2 ml-2 space-x-1">
              <span className="text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">Abhimanyu AI</span>
              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
              <span className="text-xs text-muted-foreground">Just now</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
