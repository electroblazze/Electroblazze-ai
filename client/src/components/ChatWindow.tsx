import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import TypingIndicator from "@/components/TypingIndicator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { apiRequest } from "@/lib/queryClient";
import type { Message } from "@shared/schema";
import type { ModelParameters } from "@shared/schema";

interface ChatWindowProps {
  conversationId: number | null;
  systemPrompt: string;
  modelParameters: ModelParameters;
  toggleSidebar: () => void;
}

const ChatWindow = ({ 
  conversationId, 
  systemPrompt, 
  modelParameters,
  toggleSidebar 
}: ChatWindowProps) => {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Fetch messages for the current conversation
  const { data: fetchedMessages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['/api/conversations', conversationId, 'messages'],
    enabled: !!conversationId,
  });
  
  // Update messages when fetched data changes
  useEffect(() => {
    if (fetchedMessages) {
      setMessages(fetchedMessages);
    }
  }, [fetchedMessages]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, isLoading]);
  
  // Handle sending a message
  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId) return;
    
    // Add user message to UI immediately
    const userMessage: Message = {
      id: Date.now(),
      conversationId,
      role: "user",
      content: message,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);
    
    try {
      // Prepare API request
      const apiMessages = messages.map(msg => ({
        role: msg.role as "system" | "user" | "assistant",
        content: msg.content
      }));
      
      // Add system prompt if it's not already in the messages
      if (!apiMessages.some(msg => msg.role === "system")) {
        apiMessages.unshift({
          role: "system",
          content: systemPrompt
        });
      }
      
      // Create the EventSource for streaming response
      const body = {
        conversationId,
        message: message.trim(),
        messages: apiMessages,
        parameters: modelParameters
      };
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      });
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("Failed to get response reader");
      }
      
      let partialResponse = "";
      let assistantMessage: Message = {
        id: Date.now() + 1,
        conversationId,
        role: "assistant",
        content: "",
        timestamp: new Date()
      };
      
      // Add empty assistant message to start with
      setMessages(prev => [...prev, assistantMessage]);
      
      const processChunk = async () => {
        try {
          const { done, value } = await reader.read();
          
          if (done) {
            setIsLoading(false);
            return;
          }
          
          // Convert the chunk to text
          const chunk = new TextDecoder().decode(value);
          partialResponse += chunk;
          
          // Process each line
          const lines = partialResponse.split('\n\n');
          partialResponse = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith('data:')) {
              const data = line.slice(5).trim();
              
              if (data === '[DONE]') {
                setIsLoading(false);
                return;
              }
              
              try {
                const { content, error } = JSON.parse(data);
                
                if (error) {
                  toast({
                    title: "Error",
                    description: error,
                    variant: "destructive"
                  });
                  setIsLoading(false);
                  return;
                }
                
                if (content) {
                  assistantMessage.content += content;
                  
                  // Update the assistant message in the messages array
                  setMessages(prev => {
                    const updated = [...prev];
                    const lastIndex = updated.length - 1;
                    if (updated[lastIndex]?.role === "assistant") {
                      updated[lastIndex] = { ...assistantMessage };
                    }
                    return updated;
                  });
                }
              } catch (e) {
                console.error("Error parsing JSON:", e);
              }
            }
          }
          
          // Continue processing chunks
          processChunk();
        } catch (error) {
          console.error("Error reading chunk:", error);
          setIsLoading(false);
          toast({
            title: "Error",
            description: "Failed to read response from the server",
            variant: "destructive"
          });
        }
      };
      
      processChunk();
      
    } catch (error) {
      setIsLoading(false);
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send message",
        variant: "destructive"
      });
    }
  };
  
  // Welcome message when no conversation is active
  if (!conversationId) {
    return (
      <div className="flex-1 flex flex-col bg-neutral-100 overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-2xl mx-auto mb-6">
            <div className="text-center py-8">
              <div className="w-40 h-40 mx-auto mb-4 rounded-lg shadow-lg bg-primary flex items-center justify-center text-white text-5xl">
                <i className="fas fa-robot"></i>
              </div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">Welcome to NemoChat</h2>
              <p className="text-neutral-600 mb-4">Powered by Llama 3.1 Nemotron Ultra 253B model</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Badge variant="outline" className="bg-neutral-200 text-neutral-700">Coding</Badge>
                <Badge variant="outline" className="bg-neutral-200 text-neutral-700">Writing</Badge>
                <Badge variant="outline" className="bg-neutral-200 text-neutral-700">Research</Badge>
                <Badge variant="outline" className="bg-neutral-200 text-neutral-700">Problem Solving</Badge>
                <Badge variant="outline" className="bg-neutral-200 text-neutral-700">Learning</Badge>
              </div>
              <Button onClick={toggleSidebar} className="mt-4">
                <i className="fas fa-arrow-left mr-2"></i> Open Sidebar
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col bg-neutral-100 overflow-hidden">
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 md:p-6">
        {isLoadingMessages ? (
          // Loading state
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="animate-pulse space-y-3">
              <div className="h-20 bg-neutral-200 rounded-lg"></div>
              <div className="h-20 bg-neutral-200 rounded-lg ml-auto w-2/3"></div>
              <div className="h-20 bg-neutral-200 rounded-lg w-3/4"></div>
            </div>
          </div>
        ) : messages.length === 0 ? (
          // Welcome message for new chat
          <div className="max-w-2xl mx-auto mb-6">
            <div className="text-center py-8">
              <div className="w-40 h-40 mx-auto mb-4 rounded-lg shadow-lg bg-primary flex items-center justify-center text-white text-5xl">
                <i className="fas fa-robot"></i>
              </div>
              <h2 className="text-2xl font-bold text-neutral-800 mb-2">Welcome to NemoChat</h2>
              <p className="text-neutral-600 mb-4">Powered by Llama 3.1 Nemotron Ultra 253B model</p>
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                <Badge variant="outline" className="bg-neutral-200 text-neutral-700">Coding</Badge>
                <Badge variant="outline" className="bg-neutral-200 text-neutral-700">Writing</Badge>
                <Badge variant="outline" className="bg-neutral-200 text-neutral-700">Research</Badge>
                <Badge variant="outline" className="bg-neutral-200 text-neutral-700">Problem Solving</Badge>
                <Badge variant="outline" className="bg-neutral-200 text-neutral-700">Learning</Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <Card className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-medium text-neutral-800 mb-2">
                  <i className="fas fa-lightbulb text-accent mr-2"></i>Ask me anything
                </h3>
                <p className="text-sm text-neutral-600">
                  I'm trained to help with a wide range of topics, from coding to creative writing.
                </p>
              </Card>
              <Card className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-medium text-neutral-800 mb-2">
                  <i className="fas fa-code text-secondary mr-2"></i>Code assistance
                </h3>
                <p className="text-sm text-neutral-600">
                  Need help with programming? I can explain concepts, debug, or generate code.
                </p>
              </Card>
              <Card className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-medium text-neutral-800 mb-2">
                  <i className="fas fa-edit text-primary mr-2"></i>Content creation
                </h3>
                <p className="text-sm text-neutral-600">
                  I can help draft emails, blog posts, stories, or other written content.
                </p>
              </Card>
              <Card className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition">
                <h3 className="font-medium text-neutral-800 mb-2">
                  <i className="fas fa-brain text-secondary mr-2"></i>Learning companion
                </h3>
                <p className="text-sm text-neutral-600">
                  Exploring a new topic? I can explain concepts and answer questions.
                </p>
              </Card>
            </div>
          </div>
        ) : (
          // Display chat messages
          <div className="max-w-2xl mx-auto space-y-6">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}
        <div id="messages-end"></div>
      </ScrollArea>
      
      <ChatInput 
        message={message}
        setMessage={setMessage}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        onSettingsClick={toggleSidebar}
      />
    </div>
  );
};

export default ChatWindow;
