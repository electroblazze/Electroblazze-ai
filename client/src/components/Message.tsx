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
      className={`animate-slide-up flex items-start space-x-2 sm:space-x-4 max-w-3xl mx-auto mb-4 sm:mb-6 px-1 sm:px-0 ${
        message.role === "user" ? "justify-end" : ""
      }`}
    >
      {message.role === "user" ? (
        <>
          <div className="flex-1 text-right">
            <div className="user-message rounded-xl sm:rounded-2xl rounded-tr-sm px-3 sm:px-5 py-2.5 sm:py-3.5 shadow-md inline-block transition-all hover:shadow-lg">
              <div 
                className="prose prose-sm max-w-none text-sm sm:text-base"
                dangerouslySetInnerHTML={{ 
                  __html: formatMessageContent(message.content) 
                }} 
              />
            </div>
            <div className="flex items-center justify-end mt-1 sm:mt-2 mr-2 space-x-1">
              <span className="text-[10px] sm:text-xs text-muted-foreground">You</span>
              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Just now</span>
            </div>
          </div>
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-secondary/80 to-secondary shadow-md flex items-center justify-center border-2 border-white">
            <User className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
        </>
      ) : (
        <>
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-primary to-secondary shadow-md flex items-center justify-center border-2 border-white">
            <BrainCircuit className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="ai-message rounded-xl sm:rounded-2xl rounded-tl-sm px-3 sm:px-5 py-2.5 sm:py-3.5 shadow-md relative transition-all hover:shadow-lg">
              <div 
                className="prose prose-sm max-w-none text-sm sm:text-base"
                dangerouslySetInnerHTML={{ 
                  __html: formatMessageContent(message.content) 
                }} 
              />
              <div className="absolute -top-2 -left-2 sm:-top-3 sm:-left-3">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-accent animate-pulse opacity-70" />
              </div>
            </div>
            <div className="flex items-center mt-1 sm:mt-2 ml-2 space-x-1">
              <span className="text-[10px] sm:text-xs font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">Abhimanyu AI</span>
              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground"></span>
              <span className="text-[10px] sm:text-xs text-muted-foreground">Just now</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
