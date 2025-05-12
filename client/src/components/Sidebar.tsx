import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import type { Conversation, Template } from "@shared/schema";

interface SidebarProps {
  isOpen: boolean;
  isMobile: boolean;
  conversations: Conversation[];
  templates: Template[];
  activeConversationId: number | null;
  onNewChat: () => void;
  onSelectConversation: (id: number) => void;
  isLoading: boolean;
}

const Sidebar = ({
  isOpen,
  isMobile,
  conversations,
  templates,
  activeConversationId,
  onNewChat,
  onSelectConversation,
  isLoading
}: SidebarProps) => {
  // Conditionally show sidebar based on props
  const showSidebar = isMobile || (isOpen && !isMobile);
  
  // Format relative time
  const formatRelativeTime = (dateString: Date) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };
  
  // If sidebar shouldn't be shown, return null
  if (!showSidebar) return null;
  
  return (
    <div className={`${isMobile ? 'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm' : ''} md:relative`}>
      <div className={`
        ${isMobile ? 'fixed inset-y-0 left-0 w-3/4 max-w-xs z-50 animate-in slide-in-from-left' : 'w-64'} 
        bg-white border-r border-neutral-200 h-full overflow-hidden transition-all duration-300
      `}>
        <div className="p-4">
          <Button 
            onClick={onNewChat}
            className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition mb-4"
          >
            <i className="fas fa-plus mr-2"></i> New Chat
          </Button>
          
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="space-y-1 mt-6">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Recent Chats</h3>
              
              {isLoading ? (
                // Loading skeletons
                <>
                  <div className="space-y-2">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                  </div>
                </>
              ) : conversations.length === 0 ? (
                <p className="text-sm text-neutral-500 py-2">No conversations yet</p>
              ) : (
                // Map through conversations
                conversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant="ghost"
                    onClick={() => onSelectConversation(conversation.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-200 flex items-center group transition
                      ${activeConversationId === conversation.id ? 'bg-neutral-200' : ''}
                    `}
                  >
                    <i className="fas fa-comment-alt text-neutral-500 mr-2"></i>
                    <span className="text-sm text-neutral-800 truncate flex-1">{conversation.title}</span>
                    <span className="text-xs text-neutral-500 hidden group-hover:inline">
                      {formatRelativeTime(conversation.updatedAt)}
                    </span>
                  </Button>
                ))
              )}
            </div>
            
            <div className="border-t border-neutral-200 my-4"></div>
            
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Saved Templates</h3>
              
              {isLoading ? (
                // Loading skeletons
                <>
                  <div className="space-y-2">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                  </div>
                </>
              ) : templates.length === 0 ? (
                <p className="text-sm text-neutral-500 py-2">No templates yet</p>
              ) : (
                // Map through templates
                templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="ghost"
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-neutral-200 flex items-center transition"
                  >
                    <i className="fas fa-bookmark text-secondary mr-2"></i>
                    <span className="text-sm text-neutral-800">{template.name}</span>
                  </Button>
                ))
              )}
              
              <Button
                variant="ghost"
                className="w-full text-left px-3 py-2 text-primary hover:bg-neutral-200 flex items-center transition"
              >
                <i className="fas fa-plus-circle mr-2"></i>
                <span className="text-sm">Create New Template</span>
              </Button>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
