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
    <div className={styles.container}>
      {/* Decorative background */}
      <div className={styles.background}>
        <div className={styles.backgroundBlur1}></div>
        <div className={styles.backgroundBlur2}></div>
        <div className={styles.backgroundGrid}></div>
        
        {/* Side elements (left) */}
        <div className={styles.leftSideElement}>
          <div className={styles.leftIcon}>
            <Lightbulb className="h-5 w-5" />
          </div>
        </div>
        
        {/* Side elements (right) */}
        <div className={styles.rightSideElement}>
          <div className={styles.rightIcon}>
            <Code className="h-5 w-5" />
          </div>
        </div>
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
                {/* Brainstorm Ideas */}
                <div 
                  className={styles.suggestionCard} 
                  onClick={() => sendMessage(messageSuggestions[0].text)}
                >
                  <div className={styles.suggestionContent}>
                    <div className={styles.suggestionInfo}>
                      <div className={styles.suggestionTitle}>Brainstorm Ideas</div>
                      <div className={styles.suggestionDescription}>Can you help me brainstorm creative ideas for a digital art project?</div>
                    </div>
                  </div>
                  <div className={styles.suggestionIconContainer}>
                    <Lightbulb className={styles.suggestionIcon} />
                  </div>
                </div>
                
                {/* Explain a Concept */}
                <div 
                  className={styles.suggestionCard} 
                  onClick={() => sendMessage(messageSuggestions[1].text)}
                >
                  <div className={styles.suggestionContent}>
                    <div className={styles.suggestionInfo}>
                      <div className={styles.suggestionTitle}>Explain a Concept</div>
                      <div className={styles.suggestionDescription}>Can you explain how machine learning works in simple terms?</div>
                    </div>
                  </div>
                  <div className={styles.suggestionIconContainer}>
                    <BookOpen className={styles.suggestionIcon} />
                  </div>
                </div>
                
                {/* Draft Content */}
                <div 
                  className={styles.suggestionCard} 
                  onClick={() => sendMessage(messageSuggestions[2].text)}
                >
                  <div className={styles.suggestionContent}>
                    <div className={styles.suggestionInfo}>
                      <div className={styles.suggestionTitle}>Draft Content</div>
                      <div className={styles.suggestionDescription}>Help me write a professional email to reschedule a business meeting.</div>
                    </div>
                  </div>
                  <div className={styles.suggestionIconContainer}>
                    <Code className={styles.suggestionIcon} />
                  </div>
                </div>
                
                {/* Problem Solving */}
                <div 
                  className={styles.suggestionCard} 
                  onClick={() => sendMessage(messageSuggestions[3].text)}
                >
                  <div className={styles.suggestionContent}>
                    <div className={styles.suggestionInfo}>
                      <div className={styles.suggestionTitle}>Problem Solving</div>
                      <div className={styles.suggestionDescription}>What are some strategies for improving productivity when working from home?</div>
                    </div>
                  </div>
                  <div className={styles.suggestionIconContainer}>
                    <Archive className={styles.suggestionIcon} />
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
