import { useEffect, useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import SettingsSidebar from "@/components/SettingsSidebar";
import { useNemotronChat } from "@/hooks/useNemotronChat";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();
  
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
      />
      
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 flex flex-col relative pb-32">
          <MessageList 
            messages={messages} 
            isGenerating={isGenerating} 
          />
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
