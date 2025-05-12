import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import SettingsPanel from "@/components/SettingsPanel";
import { useChatStore } from "@/hooks/useChatStore";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

const ChatInterface = () => {
  const { toast } = useToast();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Get state from chat store
  const { 
    activeConversationId,
    setActiveConversationId,
    modelParameters,
    systemPrompt
  } = useChatStore();
  
  // Fetch conversation list
  const { data: conversations, isLoading: isLoadingConversations } = useQuery({
    queryKey: ['/api/conversations'],
    staleTime: 60000, // 1 minute
  });
  
  // Fetch templates
  const { data: templates, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['/api/templates'],
    staleTime: 300000, // 5 minutes
  });
  
  // Create new conversation mutation
  const createConversation = useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest('POST', '/api/conversations', { title });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      setActiveConversationId(data.id);
      toast({
        title: "New conversation created",
        description: "You can start chatting now.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to create conversation",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  });
  
  // Create a new conversation on initial load if none exists
  useEffect(() => {
    if (!isLoadingConversations && conversations && conversations.length === 0) {
      createConversation.mutate("New Chat");
    } else if (!isLoadingConversations && conversations && conversations.length > 0 && !activeConversationId) {
      // Set the first conversation as active if none is selected
      setActiveConversationId(conversations[0].id);
    }
  }, [isLoadingConversations, conversations, activeConversationId]);
  
  // Handle new chat button click
  const handleNewChat = () => {
    createConversation.mutate("New Chat");
    setIsMobileMenuOpen(false);
  };
  
  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Toggle settings panel
  const toggleSettingsPanel = () => {
    setIsSettingsPanelOpen(!isSettingsPanelOpen);
  };
  
  // Close mobile menu when a conversation is selected
  const handleConversationSelect = (id: number) => {
    setActiveConversationId(id);
    setIsMobileMenuOpen(false);
  };
  
  // Toggle sidebar visibility (for smaller screens)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <div className="flex flex-col h-screen bg-neutral-100">
      <Header 
        isMobileMenuOpen={isMobileMenuOpen} 
        toggleMobileMenu={toggleMobileMenu}
        toggleSettingsPanel={toggleSettingsPanel}
        onNewChat={handleNewChat}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen}
          isMobile={isMobileMenuOpen}
          conversations={conversations || []}
          templates={templates || []}
          activeConversationId={activeConversationId}
          onNewChat={handleNewChat}
          onSelectConversation={handleConversationSelect}
          isLoading={isLoadingConversations || isLoadingTemplates}
        />
        
        <ChatWindow 
          conversationId={activeConversationId}
          systemPrompt={systemPrompt}
          modelParameters={modelParameters}
          toggleSidebar={toggleSidebar}
        />
        
        <SettingsPanel 
          isOpen={isSettingsPanelOpen}
          onClose={() => setIsSettingsPanelOpen(false)}
        />
      </div>
    </div>
  );
};

export default ChatInterface;
