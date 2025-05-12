import { useState, useEffect } from 'react';
import { Message, ModelSettings } from '@/lib/types';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

// Default settings
const DEFAULT_SETTINGS: ModelSettings = {
  temperature: 0.6,
  top_p: 0.95,
  max_tokens: 4096,
  frequency_penalty: 0,
  presence_penalty: 0,
};

// Initial system message
const SYSTEM_MESSAGE: Message = {
  role: 'system',
  content: 'You are Abhimanyu AI, a helpful assistant powered by electroblazze.'
};

// Initial welcome message
const WELCOME_MESSAGE: Message = {
  role: 'assistant',
  content: 'Hello! I\'m Abhimanyu AI, powered by electroblazze. How can I help you today?'
};

export function useNemotronChat() {
  const [messages, setMessages] = useState<Message[]>([SYSTEM_MESSAGE, WELCOME_MESSAGE]);
  const [settings, setSettings] = useState<ModelSettings>(DEFAULT_SETTINGS);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  // Load messages and settings from session storage on initialization
  useEffect(() => {
    try {
      const savedMessages = sessionStorage.getItem('nemoChat_messages');
      const savedSettings = sessionStorage.getItem('nemoChat_settings');
      
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
      
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error('Error loading from sessionStorage:', error);
    }
  }, []);

  // Save messages and settings to session storage when they change
  useEffect(() => {
    try {
      sessionStorage.setItem('nemoChat_messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to sessionStorage:', error);
    }
  }, [messages]);

  useEffect(() => {
    try {
      sessionStorage.setItem('nemoChat_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings to sessionStorage:', error);
    }
  }, [settings]);

  // Send a message to the AI and process the response
  const sendMessage = async (content: string) => {
    if (!content.trim() || isGenerating) return;

    // Add user message to state
    const userMessage: Message = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsGenerating(true);

    try {
      const response = await apiRequest('POST', '/api/chat', {
        messages: [...messages, userMessage],
        settings
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get response from AI');
      }

      // Process the streaming response by reading the response body as a stream
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response body is not readable');

      // Create a placeholder for the AI's response
      const aiMessage: Message = { role: 'assistant', content: '' };
      setMessages(prev => [...prev, aiMessage]);

      // Read the stream
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and append it to the AI message
        const chunk = new TextDecoder().decode(value);
        
        // Update the AI message with the new content
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage.role === 'assistant') {
            lastMessage.content += chunk;
          }
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error communicating with AI:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to communicate with the AI service',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Clear the chat
  const clearChat = () => {
    setMessages([SYSTEM_MESSAGE, WELCOME_MESSAGE]);
  };

  // Update settings
  const updateSettings = (newSettings: Partial<ModelSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return {
    messages,
    settings,
    isGenerating,
    sendMessage,
    clearChat,
    updateSettings,
    resetSettings,
  };
}
