import { Message as MessageType } from "@/lib/types";
import { formatMessageContent } from "@/lib/utils";

interface MessageProps {
  message: MessageType;
}

export default function Message({ message }: MessageProps) {
  if (message.role === "system") return null;

  return (
    <div
      className={`animate-fade-in flex items-start space-x-3 max-w-3xl mx-auto ${
        message.role === "user" ? "justify-end" : ""
      }`}
    >
      {message.role === "user" ? (
        <>
          <div className="flex-1 text-right">
            <div className="bg-userMessage text-gray-800 rounded-2xl px-4 py-3 shadow-sm inline-block">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: formatMessageContent(message.content) 
                }} 
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 mr-2">You • Just now</div>
          </div>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </>
      ) : (
        <>
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
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
          <div className="flex-1">
            <div className="bg-aiMessage rounded-2xl px-4 py-3 shadow-sm">
              <div 
                className="text-gray-800"
                dangerouslySetInnerHTML={{ 
                  __html: formatMessageContent(message.content) 
                }} 
              />
            </div>
            <div className="text-xs text-gray-500 mt-1 ml-2">
              Nemotron Ultra • Just now
            </div>
          </div>
        </>
      )}
    </div>
  );
}
