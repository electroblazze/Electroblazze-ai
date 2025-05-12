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
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-100 px-3 sm:px-6 py-3 flex items-center justify-center shadow-sm sticky top-0 z-10">
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="bg-indigo-600 p-1.5 sm:p-2 rounded-full">
            <BrainCircuit 
              className="text-white h-4 w-4 sm:h-5 sm:w-5" 
            />
          </div>
          <div>
            <h1 className="font-bold text-lg sm:text-xl text-indigo-600">
              Abhimanyu AI
            </h1>
            <p className="text-[10px] sm:text-xs text-gray-600 font-medium italic">Ancient Wisdom, Modern Intelligence</p>
            <div className="flex items-center space-x-2 mt-0.5">
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleSettings}
            className="flex items-center px-2 sm:px-3 h-8 rounded-lg border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-300"
          >
            <Sliders className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline ml-1">Settings</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={exportChat}
            className="flex items-center px-2 sm:px-3 h-8 rounded-lg border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-300"
          >
            <Download className="h-4 w-4 text-primary" />
            <span className="hidden sm:inline ml-1">Export Chat</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareChat}
            className="flex items-center px-2 sm:px-3 h-8 rounded-lg border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-300"
          >
            <Share2 className="h-4 w-4 text-accent" />
            <span className="hidden sm:inline ml-1">Share Chat</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onClearChat}
            className="flex items-center px-2 sm:px-3 h-8 rounded-lg border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-300 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
            <span className="hidden sm:inline ml-1">Clear Chat</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
