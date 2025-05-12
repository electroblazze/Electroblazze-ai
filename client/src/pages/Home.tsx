import { useEffect, useState } from "react";
import ChatHeader from "@/components/ChatHeader";
import MessageList from "@/components/MessageList";
import MessageInput from "@/components/MessageInput";
import SettingsSidebar from "@/components/SettingsSidebar";
import { useNemotronChat } from "@/hooks/useNemotronChat";
import { useToast } from "@/hooks/use-toast";
import { 
  BrainCircuit, 
  Sparkles, 
  Archive, 
  Code, 
  BookOpen, 
  Lightbulb
} from "lucide-react";
import styles from "./Home.module.css";

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { toast } = useToast();
  
  // Predefined message suggestions
  const messageSuggestions = [
    {
      icon: <Lightbulb className={styles.suggestionIcon} />,
      text: "Can you help me brainstorm creative ideas for a digital art project?",
      category: "Brainstorm Ideas"
    },
    {
      icon: <BookOpen className={styles.suggestionIcon} />,
      text: "Can you explain how machine learning works in simple terms?",
      category: "Explain a Concept"
    },
    {
      icon: <Code className={styles.suggestionIcon} />,
      text: "Help me write a professional email to reschedule a business meeting.",
      category: "Draft Content"
    },
    {
      icon: <Archive className={styles.suggestionIcon} />,
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
    <div className={styles.container}>
      {/* Decorative background */}
      <div className={styles.background}>
        <div className={styles.backgroundBlur1}></div>
        <div className={styles.backgroundBlur2}></div>
        <div className={styles.backgroundGrid}></div>
      </div>

      <ChatHeader 
        onToggleSettings={toggleSettings} 
        onClearChat={handleClearChat}
        messages={messages}
      />
      
      <div className={styles.mainContent}>
        <main className={styles.contentContainer}>
          {messages.length === 0 ? (
            <div className={styles.welcomeContainer}>
              {/* Welcome header with icon */}
              <div className={styles.welcomeHeader}>
                <div className={styles.welcomeIconContainer}>
                  <div className={styles.welcomeIcon}>
                    <div className={styles.welcomeIconCircle}>
                      <BrainCircuit className="text-white h-8 w-8" />
                    </div>
                  </div>
                  <div>
                    <h1 className={styles.welcomeTitle}>
                      Welcome to Abhimanyu AI
                    </h1>
                    <p className={styles.welcomeSubtitle}>
                      Your intelligent conversation partner
                    </p>
                  </div>
                </div>
                
                <p className={styles.welcomeDescription}>
                  I'm here to help with a wide range of tasks - from answering questions and generating content to
                  brainstorming ideas and solving problems.
                </p>
                
                <div className={styles.suggestionsHeader}>
                  <div className={styles.suggestionsTitle}>
                    <Sparkles className={styles.suggestionsIcon} />
                    <span className={styles.suggestionsText}>Try asking about...</span>
                  </div>
                </div>
              </div>
              
              {/* Suggestion cards - 2x2 grid */}
              <div className={styles.suggestionsGrid}>
                {messageSuggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    className={styles.suggestionCard} 
                    onClick={() => sendMessage(suggestion.text)}
                  >
                    <div className={styles.suggestionContent}>
                      <div className={styles.suggestionInfo}>
                        <div className={styles.suggestionTitle}>{suggestion.category}</div>
                        <div className={styles.suggestionDescription}>{suggestion.text}</div>
                      </div>
                    </div>
                    <div className={styles.suggestionIconContainer}>
                      {suggestion.icon}
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
