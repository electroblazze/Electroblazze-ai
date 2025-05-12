import { useEffect, useRef } from "react";
import { Message as MessageType } from "@/lib/types";
import Message from "@/components/Message";
import TypingIndicator from "@/components/TypingIndicator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BrainCircuit, Sparkles, ArrowRight, Blocks, Rocket, BookOpen, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface MessageListProps {
  messages: MessageType[];
  isGenerating: boolean;
  onSendMessage?: (message: string) => void;
}

// Quick chat suggestion topics
const CHAT_SUGGESTIONS = [
  {
    title: "Brainstorm Ideas",
    prompt: "Can you help me brainstorm creative ideas for a digital art project?",
    icon: <Blocks className="h-4 w-4" />
  },
  {
    title: "Explain a Concept",
    prompt: "Can you explain how machine learning works in simple terms?",
    icon: <BookOpen className="h-4 w-4" />
  },
  {
    title: "Draft Content",
    prompt: "Help me write a professional email to reschedule a business meeting.",
    icon: <Code className="h-4 w-4" />
  },
  {
    title: "Problem Solving",
    prompt: "What are some strategies for improving productivity when working from home?",
    icon: <Rocket className="h-4 w-4" />
  }
];

export default function MessageList({ messages, isGenerating, onSendMessage }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Show welcome screen if only system message and welcome message are present
  const showWelcome = messages.length <= 2 && 
    messages.some(m => m.role === 'system') && 
    messages.some(m => m.role === 'assistant');

  return (
    <ScrollArea className="flex-1 p-2 sm:p-4">
      <div className="space-y-4 max-w-3xl mx-auto pb-20">
        {/* Welcome screen */}
        {showWelcome && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl border border-white/20 my-4 sm:my-8"
          >
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
                <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">
                  Welcome to Abhimanyu AI
                </h2>
                <p className="text-xs sm:text-sm text-gray-600">Your intelligent conversation partner</p>
              </div>
            </div>

            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
              I'm here to help with a wide range of tasks - from answering questions and generating content to brainstorming ideas and solving problems.
            </p>

            <div className="space-y-3">
              <h3 className="text-xs sm:text-sm font-medium flex items-center text-gray-700">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-accent" />
                Try asking about...
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {CHAT_SUGGESTIONS.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="p-2.5 sm:p-4 h-auto flex items-start text-left bg-white/80 hover:bg-white hover:shadow-md transition-all border border-gray-200 group w-full"
                    onClick={() => onSendMessage?.(suggestion.prompt)}
                  >
                    <div className="mr-2.5 sm:mr-3 mt-0.5 bg-primary/10 p-1.5 sm:p-2 rounded-full flex-shrink-0">
                      {suggestion.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 mb-1 text-sm sm:text-base truncate">{suggestion.title}</h4>
                      <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2 leading-relaxed break-words">{suggestion.prompt}</p>
                    </div>
                    <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1.5 sm:ml-2 mt-1 flex-shrink-0" />
                  </Button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Message list */}
        {messages.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        
        {isGenerating && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
}
