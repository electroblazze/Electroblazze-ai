export default function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 max-w-3xl mx-auto">
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
        <div className="bg-aiMessage rounded-2xl px-4 py-3 shadow-sm inline-flex items-center">
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-typing-dot-1"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full mx-1 animate-typing-dot-2"></div>
          <div className="h-2 w-2 bg-gray-400 rounded-full animate-typing-dot-3"></div>
        </div>
      </div>
    </div>
  );
}
