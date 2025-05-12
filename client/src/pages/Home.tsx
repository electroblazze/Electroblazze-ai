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
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[#f0f4f9]">
        <div className="absolute -top-[40%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-50 blur-3xl"></div>
        <div className="absolute -bottom-[30%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-50 blur-3xl"></div>
        <div className="absolute pointer-events-none inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDUgTCAyMCA1IE0gNSAwIEwgNSAyMCIgc3Ryb2tlPSIjOTk5IiBzdHJva2Utd2lkdGg9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIgb3BhY2l0eT0iMC4wMiIvPjwvc3ZnPg==')] opacity-30"></div>
        
        {/* Side elements (left) */}
        <div className="absolute left-8 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col gap-4">
          <div className="bg-blue-50 text-blue-600 h-10 w-10 rounded-lg flex items-center justify-center shadow-sm">
            <Lightbulb className="h-5 w-5" />
          </div>
        </div>
        
        {/* Side elements (right) */}
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:flex flex-col gap-4">
          <div className="bg-indigo-50 text-indigo-600 h-10 w-10 rounded-lg flex items-center justify-center shadow-sm">
            <Code className="h-5 w-5" />
          </div>
        </div>
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
              {/* Welcome header with icon */}
              <div className="mb-6">
                <div className="flex items-center gap-5 mb-3">
                  <div className="flex-shrink-0 relative">
                    <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
                      <BrainCircuit className="text-white h-8 w-8" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-indigo-600">
                      Welcome to Abhimanyu AI
                    </h1>
                    <p className="text-gray-600 text-sm">
                      Your intelligent conversation partner
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 ml-0">
                  I'm here to help with a wide range of tasks - from answering questions and generating content to
                  brainstorming ideas and solving problems.
                </p>
                
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-teal-500" />
                    <span className="text-sm font-medium text-gray-800">Try asking about...</span>
                  </div>
                </div>
              </div>
              
              {/* Suggestion cards - 2x2 grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6">
                {/* Brainstorm Ideas */}
                <div 
                  className="rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 cursor-pointer" 
                  onClick={() => sendMessage(messageSuggestions[0].text)}
                >
                  <div className="flex p-4">
                    <div className="mr-3 bg-blue-100 p-2 rounded-lg flex items-center justify-center">
                      <Lightbulb className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Brainstorm Ideas</div>
                      <div className="text-xs text-gray-500">Can you help me brainstorm creative ideas for a digital art project?</div>
                    </div>
                  </div>
                </div>
                
                {/* Explain a Concept */}
                <div 
                  className="rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 cursor-pointer" 
                  onClick={() => sendMessage(messageSuggestions[1].text)}
                >
                  <div className="flex p-4">
                    <div className="mr-3 bg-purple-100 p-2 rounded-lg flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Explain a Concept</div>
                      <div className="text-xs text-gray-500">Can you explain how machine learning works in simple terms?</div>
                    </div>
                  </div>
                </div>
                
                {/* Draft Content */}
                <div 
                  className="rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 cursor-pointer" 
                  onClick={() => sendMessage(messageSuggestions[2].text)}
                >
                  <div className="flex p-4">
                    <div className="mr-3 bg-indigo-100 p-2 rounded-lg flex items-center justify-center">
                      <Code className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Draft Content</div>
                      <div className="text-xs text-gray-500">Help me write a professional email to reschedule a business meeting.</div>
                    </div>
                  </div>
                </div>
                
                {/* Problem Solving */}
                <div 
                  className="rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all duration-300 cursor-pointer" 
                  onClick={() => sendMessage(messageSuggestions[3].text)}
                >
                  <div className="flex p-4">
                    <div className="mr-3 bg-teal-100 p-2 rounded-lg flex items-center justify-center">
                      <Archive className="h-5 w-5 text-teal-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 mb-1">Problem Solving</div>
                      <div className="text-xs text-gray-500">What are some strategies for improving productivity when working from home?</div>
                    </div>
                  </div>
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
