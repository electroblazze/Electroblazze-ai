import { Button } from "@/components/ui/button";
import { Sliders, Trash2, Sparkles, BrainCircuit } from "lucide-react";

interface ChatHeaderProps {
  onToggleSettings: () => void;
  onClearChat: () => void;
}

export default function ChatHeader({ onToggleSettings, onClearChat }: ChatHeaderProps) {
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
          <Button
            variant="outline"
            size="sm"
            onClick={onClearChat}
            className="flex items-center space-x-1 rounded-lg border-gray-200 shadow-sm hover:bg-gray-50 hover:shadow transition-all duration-300"
          >
            <Trash2 className="h-4 w-4 text-accent" />
            <span>Clear</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
