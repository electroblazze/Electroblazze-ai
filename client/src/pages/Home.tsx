import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
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
    <div className="bg-gray-50 text-gray-900 h-screen flex flex-col">
      <ChatHeader 
        onToggleSettings={toggleSettings} 
        onClearChat={handleClearChat} 
      />
      
      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 flex flex-col relative">
          <MessageList 
            messages={messages} 
            isGenerating={isGenerating} 
          />
          
          <MessageInput 
            onSendMessage={sendMessage} 
            isGenerating={isGenerating} 
          />
        </main>
        
        <SettingsSidebar 
          isOpen={settingsOpen} 
          onClose={toggleSettings}
          settings={settings}
          onUpdateSettings={updateSettings}
          onResetSettings={handleResetSettings}
        />
      </div>
    </div>
  );
}
