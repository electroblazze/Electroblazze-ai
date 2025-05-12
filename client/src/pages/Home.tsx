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
      icon: <BookOpen className="h-5 w-5 text-blue-500" />,
      text: "Explain quantum computing to a 10-year-old",
      category: "Learning"
    },
    {
      icon: <Code className="h-5 w-5 text-emerald-500" />,
      text: "Help me debug this React code snippet: useEffect(() => {}, [])",
      category: "Coding"
    },
    {
      icon: <Lightbulb className="h-5 w-5 text-yellow-500" />,
      text: "Generate a creative story about a time-traveling scientist",
      category: "Creative"
    },
    {
      icon: <Archive className="h-5 w-5 text-purple-500" />,
      text: "Summarize the history of artificial intelligence",
      category: "Knowledge"
    },
    {
      icon: <Palette className="h-5 w-5 text-pink-500" />,
      text: "Describe five painting techniques for beginners",
      category: "Art"
    },
    {
      icon: <GraduationCap className="h-5 w-5 text-orange-500" />,
      text: "What are the key theories in modern psychology?",
      category: "Education"
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
            <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-in">
              <div className="mb-8 text-center">
                <div className="relative inline-block mb-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-50 animate-pulse-slow"></div>
                  <div className="relative bg-gradient-to-r from-primary to-secondary p-4 rounded-full inline-flex items-center justify-center glow-effect">
                    <BrainCircuit className="text-white h-10 w-10" />
                  </div>
                </div>
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary mb-2 animate-gradient">
                  Welcome to Abhimanyu
                </h1>
                <p className="text-muted-foreground max-w-lg mx-auto">
                  Your advanced AI assistant, ready to help with a wide range of tasks. 
                  Just start typing or choose one of the suggestions below.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mb-6">
                {messageSuggestions.map((suggestion, index) => (
                  <Card 
                    key={index}
                    className="p-4 border border-gray-200 hover:border-primary/30 hover:shadow-md transition-all duration-300 cursor-pointer group"
                    onClick={() => sendMessage(suggestion.text)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="p-2 bg-gray-50 rounded-md group-hover:bg-primary/10 transition-colors">
                        {suggestion.icon}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs text-muted-foreground mb-1">
                          {suggestion.category}
                        </div>
                        <div className="text-sm font-medium">
                          {suggestion.text}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 bg-accent/10 text-accent px-3 py-2 rounded-lg text-sm">
                  <Rocket className="h-4 w-4" />
                  <span>Powered by state-of-the-art AI technology</span>
                </div>
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
