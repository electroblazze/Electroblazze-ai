import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HeaderProps {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  toggleSettingsPanel: () => void;
  onNewChat: () => void;
}

const Header = ({ 
  isMobileMenuOpen, 
  toggleMobileMenu, 
  toggleSettingsPanel, 
  onNewChat 
}: HeaderProps) => {
  return (
    <header className="bg-white border-b border-neutral-200 py-2 px-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center text-white">
            <i className="fas fa-brain"></i>
          </div>
          <div>
            <h1 className="font-bold text-lg text-neutral-900">NemoChat</h1>
            <p className="text-xs text-neutral-600">Powered by Llama 3.1 Nemotron Ultra</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onNewChat}
                  className="text-neutral-700 hover:text-primary transition"
                >
                  <i className="fas fa-plus-circle"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent>New Chat</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-neutral-700 hover:text-primary transition"
                >
                  <i className="fas fa-history"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Chat History</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSettingsPanel} 
                  className="text-neutral-700 hover:text-primary transition"
                >
                  <i className="fas fa-sliders-h"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-neutral-700 hover:text-primary transition"
                >
                  <i className="fas fa-user-circle"></i>
                </Button>
              </TooltipTrigger>
              <TooltipContent>User Profile</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="block md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu} 
            className="text-neutral-700 hover:bg-neutral-200 p-2 rounded-lg transition"
          >
            <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </Button>
        </div>
      </div>
      
      {isMobileMenuOpen && (
        <div className="pt-2 pb-3 space-y-1 flex flex-col animate-fade-in md:hidden">
          <Button 
            variant="ghost" 
            onClick={onNewChat} 
            className="text-neutral-700 hover:bg-neutral-200 p-2 rounded-lg transition flex items-center justify-start"
          >
            <i className="fas fa-plus-circle w-6"></i> New Chat
          </Button>
          <Button 
            variant="ghost" 
            className="text-neutral-700 hover:bg-neutral-200 p-2 rounded-lg transition flex items-center justify-start"
          >
            <i className="fas fa-history w-6"></i> History
          </Button>
          <Button 
            variant="ghost" 
            onClick={toggleSettingsPanel} 
            className="text-neutral-700 hover:bg-neutral-200 p-2 rounded-lg transition flex items-center justify-start"
          >
            <i className="fas fa-sliders-h w-6"></i> Settings
          </Button>
          <Button 
            variant="ghost" 
            className="text-neutral-700 hover:bg-neutral-200 p-2 rounded-lg transition flex items-center justify-start"
          >
            <i className="fas fa-user-circle w-6"></i> Profile
          </Button>
        </div>
      )}
    </header>
  );
};

export default Header;
