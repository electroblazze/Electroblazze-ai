import { useEffect, useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import SettingsSidebar from "@/components/SettingsSidebar";
import { useNemotronChat } from "@/hooks/useNemotronChat";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  BrainCircuit, 
  Sparkles, 
  Archive, 
  Code, 
  BookOpen, 
  Lightbulb, 
  Palette, 
  GraduationCap,
  Rocket
} from "lucide-react";

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();
  
  // Predefined message suggestions
  const messageSuggestions = [
    {
      icon: <Lightbulb className="h-5 w-5 text-blue-500" />,
      text: "Can you help me brainstorm creative ideas for a digital art project?",
      category: "Brainstorm Ideas"
    },
    {
      icon: <BookOpen className="h-5 w-5 text-purple-500" />,
      text: "Can you explain how machine learning works in simple terms?",
      category: "Explain a Concept"
    },
    {
      icon: <Code className="h-5 w-5 text-indigo-500" />,
      text: "Help me write a professional email to reschedule a business meeting.",
      category: "Draft Content"
    },
    {
      icon: <Archive className="h-5 w-5 text-teal-500" />,
      text: "What are some strategies for improving productivity when working from home?",
      category: "Problem Solving"
    },
  ];
  
  const {
    messages,
    settings,
    isGenerating,
    sendMessage,
    clearChat,
    updateSettings,
    resetSettings,
  } = useNemotronChat();

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleClearChat = () => {
    clearChat();
    toast({
      title: "Chat cleared",
      description: "Chat history has been cleared",
      variant: "default",
    });
  };

  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: "Settings reset",
      description: "Settings reset to defaults",
      variant: "default",
    });
  };

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Decorative background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-secondary/5 blur-3xl"></div>
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-accent/5 blur-3xl"></div>
        <div className="absolute pointer-events-none inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDUgTCAyMCA1IE0gNSAwIEwgNSAyMCIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-30"></div>
      </div>

      <ChatHeader 
        onToggleSettings={toggleSettings} 
        onClearChat={handleClearChat}
        messages={messages}
      />
      
      <div className="flex-1 flex overflow-hidden justify-center">
        <main className="w-full max-w-4xl flex flex-col relative pb-32">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col p-6 animate-fade-in max-w-3xl mx-auto">
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-md opacity-50 animate-pulse-slow"></div>
                    <div className="relative bg-gradient-to-r from-primary to-secondary p-3 rounded-full flex items-center justify-center glow-effect">
                      <BrainCircuit className="text-white h-7 w-7" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">
                      Welcome to Abhimanyu AI
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Your intelligent conversation partner
                    </p>
                  </div>
                </div>
                <p className="text-base mb-8">
                  I'm here to help with a wide range of tasks - from answering questions and generating content to
                  brainstorming ideas and solving problems.
                </p>
                
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Try asking about...</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
                {messageSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    onClick={() => sendMessage(suggestion.text)}
                  >
                    <div className="flex items-start p-4">
                      {index === 0 && (
                        <div className="flex-shrink-0 bg-blue-100 rounded-lg p-2 mr-3">
                          <Lightbulb className="h-5 w-5 text-blue-600" />
                        </div>
                      )}
                      {index === 1 && (
                        <div className="flex-shrink-0 bg-purple-100 rounded-lg p-2 mr-3">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                      )}
                      {index === 2 && (
                        <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-2 mr-3">
                          <Code className="h-5 w-5 text-indigo-600" />
                        </div>
                      )}
                      {index === 3 && (
                        <div className="flex-shrink-0 bg-teal-100 rounded-lg p-2 mr-3">
                          <Archive className="h-5 w-5 text-teal-600" />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {suggestion.category}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-2">
                          {suggestion.text}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <MessageList 
              messages={messages} 
              isGenerating={isGenerating}
              onSendMessage={sendMessage}
            />
          )}
        </main>
      </div>
      
      <MessageInput 
        onSendMessage={sendMessage} 
        isGenerating={isGenerating} 
      />
      
      <SettingsSidebar 
        isOpen={settingsOpen} 
        onClose={toggleSettings}
        settings={settings}
        onUpdateSettings={updateSettings}
        onResetSettings={handleResetSettings}
      />
    </div>
  );
}
