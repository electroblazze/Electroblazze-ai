import { Button } from "@/components/ui/button";
import { Sliders, Trash2, Sparkles, BrainCircuit, Download, Share2, MoreVertical } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Message } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface ChatHeaderProps {
  onToggleSettings: () => void;
  onClearChat: () => void;
  messages?: Message[];
}

export default function ChatHeader({ onToggleSettings, onClearChat, messages = [] }: ChatHeaderProps) {
  const { toast } = useToast();
  
  // Function to export chat as text file
  const exportChat = () => {
    // Skip system messages
    const chatContent = messages
      .filter(msg => msg.role !== 'system')
      .map(msg => `${msg.role === 'assistant' ? 'Abhimanyu AI' : 'You'}: ${msg.content}`)
      .join('\n\n');
    
    // Generate file name with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `chat-export-${timestamp}.txt`;
    
    // Create and download file
    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Chat Exported",
      description: `Chat exported to ${fileName}`,
      variant: "default",
    });
  };
  
  // Function to copy chat link (would require backend implementation for production)
  const shareChat = () => {
    // Just a mock since this would require a backend to store chat state
    navigator.clipboard.writeText(window.location.href);
    
    toast({
      title: "Link Copied",
      description: "Chat link copied to clipboard",
      variant: "default",
    });
  };
  
  return (
    <header className="bg-white/90 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-center shadow-md sticky top-0 z-10">
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-primary to-secondary p-2.5 rounded-xl animate-pulse-slow glow-effect">
            <BrainCircuit 
              className="text-white h-6 w-6" 
            />
          </div>
          <div>
            <h1 className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">
              Abhimanyu
            </h1>
            <div className="flex items-center space-x-2 mt-0.5">
              <div className="relative">
                <span className="bg-gradient-to-r from-accent to-primary text-white text-xs px-2.5 py-0.5 rounded-full font-semibold inline-flex items-center">
                  <Sparkles className="h-3 w-3 mr-1 animate-pulse" />
                  AI
                </span>
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                </span>
              </div>
              <span className="text-xs text-muted-foreground">powered by electroblazze</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleSettings}
            className="flex items-center space-x-1 rounded-lg border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-300"
          >
            <Sliders className="h-4 w-4 text-primary" />
            <span>Settings</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="rounded-lg border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-300"
              >
                <MoreVertical className="h-4 w-4 text-gray-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white/95 backdrop-blur-sm border border-gray-200 shadow-lg">
              <DropdownMenuItem 
                className="flex items-center cursor-pointer" 
                onClick={exportChat}
              >
                <Download className="mr-2 h-4 w-4 text-primary" />
                <span>Export Chat</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center cursor-pointer" 
                onClick={shareChat}
              >
                <Share2 className="mr-2 h-4 w-4 text-accent" />
                <span>Share Chat</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="flex items-center cursor-pointer text-red-500 hover:text-red-600" 
                onClick={onClearChat}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Clear Chat</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
