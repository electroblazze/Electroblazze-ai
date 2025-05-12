import { Button } from "@/components/ui/button";
import { Sliders, Trash2 } from "lucide-react";

interface ChatHeaderProps {
  onToggleSettings: () => void;
  onClearChat: () => void;
}

export default function ChatHeader({ onToggleSettings, onClearChat }: ChatHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-2">
        <div className="bg-gradient-to-r from-primary to-secondary p-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M12 8V4H8" />
            <rect width="16" height="12" x="4" y="8" rx="2" />
            <path d="M2 14h2" />
            <path d="M20 14h2" />
            <path d="M15 13v2" />
            <path d="M9 13v2" />
          </svg>
        </div>
        <h1 className="font-bold text-xl text-gray-800">NemoChat</h1>
        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full font-medium">
          Beta
        </span>
      </div>
      <div className="flex items-center space-x-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSettings}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Sliders className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearChat}
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
