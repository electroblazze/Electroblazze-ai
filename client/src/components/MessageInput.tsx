import { useState, useRef, FormEvent, ChangeEvent, KeyboardEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  SendIcon, Sparkles, Cpu, Mic, ImagePlus, Wand2, MicOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  isGenerating: boolean;
}

export default function MessageInput({ onSendMessage, isGenerating }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const [showVoiceHelp, setShowVoiceHelp] = useState(false);
  const [usingSpeechInputType, setUsingSpeechInputType] = useState(false);
  const { toast } = useToast();
  
  // Detect if device is mobile
  const isMobile = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  // Reference to store recognition instance
  const recognitionRef = useRef<any>(null);
  
  // Initialize speech recognition if supported
  useEffect(() => {
    // Check if browser supports the Web Speech API
    const SpeechRecognition = window.SpeechRecognition || 
                             window.webkitSpeechRecognition;
    
    // Additional check for iOS devices with webkit prefixed version
    const hasWebkitSpeech = 'webkitSpeechRecognition' in window;
    
    if (SpeechRecognition) {
      setIsVoiceSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      // Configure speech recognition
      const recognition = recognitionRef.current;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      // Special handling for iOS
      if (isIOS && hasWebkitSpeech) {
        // iOS often requires re-requesting permissions
        recognition.onstart = () => {
          console.log('Speech recognition started on iOS device');
          // If on iOS 14.5+, ensure user granted permissions
          if (typeof navigator.mediaDevices !== 'undefined' && 
              typeof navigator.mediaDevices.getUserMedia === 'function') {
            navigator.mediaDevices.getUserMedia({ audio: true })
              .catch(err => {
                console.error('iOS microphone permission error:', err);
                recognition.stop();
              });
          }
        };
      }
      
      // Handle speech recognition results
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        // Get the latest result
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setMessage(transcript);
        
        // Auto-resize the textarea
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          const newHeight = Math.min(Math.max(56, textareaRef.current.scrollHeight), 200);
          textareaRef.current.style.height = `${newHeight}px`;
        }
      };
      
      // Handle speech recognition end
      recognition.onend = () => {
        setIsListening(false);
      };
      
      // Handle speech recognition errors
      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        
        // More specific error messages
        let errorMessage = "An error occurred with voice input.";
        
        switch(event.error) {
          case 'not-allowed':
            errorMessage = "Microphone access was denied. Please check your browser settings to allow microphone access.";
            break;
          case 'no-speech':
            errorMessage = "No speech was detected. Please try again.";
            break;
          case 'network':
            errorMessage = "Network error occurred. Please check your connection.";
            break;
          default:
            errorMessage = `Error: ${event.error}. Please try again.`;
        }
        
        toast({
          title: "Voice Input Error",
          description: errorMessage,
          variant: "destructive",
        });
      };
    } else if (isMobile) {
      // For some mobile browsers without proper SpeechRecognition support
      // Try to use native speech input when available
      if ('webkitSpeechRecognition' in window && isIOS) {
        // iOS specific support - sometimes works with different approach
        setIsVoiceSupported(true);
        try {
          const iOSRecognition = new (window as any).webkitSpeechRecognition();
          recognitionRef.current = iOSRecognition;
          
          iOSRecognition.continuous = false; // iOS often works better with continuous off
          iOSRecognition.interimResults = false;
          iOSRecognition.lang = 'en-US';
          
          iOSRecognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = Array.from(event.results)
              .map(result => result[0])
              .map(result => result.transcript)
              .join('');
            
            setMessage(prev => prev + ' ' + transcript);
          };
          
          iOSRecognition.onerror = () => {
            setIsListening(false);
            toast({
              title: "iOS Voice Input Error",
              description: "Please check microphone permissions in Settings > Safari > Microphone",
              variant: "destructive",
            });
          };
          
          iOSRecognition.onend = () => {
            setIsListening(false);
          };
        } catch (err) {
          console.error('Failed to initialize iOS speech recognition:', err);
          setIsVoiceSupported(false);
        }
      } else {
        // No speech recognition support available
        setIsVoiceSupported(false);
      }
    }
    
    // Cleanup on component unmount
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (err) {
          console.error('Error stopping speech recognition:', err);
        }
      }
    };
  }, [toast, isMobile]);
  
  // Mobile speech recognition workaround
  const startMobileSpeechRecognition = () => {
    // Ensure browser supports speech recognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice Input Not Supported",
        description: "Your browser doesn't support voice input. Try another browser.",
        variant: "destructive",
      });
      return;
    }

    // Try to directly request microphone permissions for mobile
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          // Successfully got microphone permission, now try to use speech recognition
          try {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            // Configure for mobile (shorter sessions work better)
            recognition.continuous = false;
            recognition.interimResults = false; 
            recognition.maxAlternatives = 1;
            recognition.lang = 'en-US';

            setIsListening(true);
            toast({
              title: "Listening...",
              description: "Speak now. Results will appear when you stop.",
              variant: "default",
            });

            recognition.onresult = (event) => {
              if (event.results && event.results[0]) {
                const transcript = event.results[0][0].transcript;
                setMessage(prev => prev ? `${prev} ${transcript}` : transcript);
              }
            };

            recognition.onerror = (event) => {
              console.error('Speech recognition error:', event.error);
              setIsListening(false);
              toast({
                title: "Voice Input Error",
                description: `Error: ${event.error}. Please try again.`,
                variant: "destructive",
              });
            };

            recognition.onend = () => {
              setIsListening(false);
            };

            recognition.start();
          } catch (err) {
            console.error('Failed to initialize speech recognition:', err);
            setIsListening(false);
            toast({
              title: "Voice Input Error",
              description: "Failed to start speech recognition. Please try again.",
              variant: "destructive",
            });
          }
        })
        .catch(err => {
          console.error('Microphone permission error:', err);
          toast({
            title: "Microphone Access Denied",
            description: "Please enable microphone access in your browser settings.",
            variant: "destructive",
          });
        });
    } else {
      toast({
        title: "Microphone Access Unavailable",
        description: "Your device doesn't support microphone access.",
        variant: "destructive",
      });
    }
  };
  
  // Toggle speech recognition
  const toggleListening = () => {
    // If on mobile, use the mobile-specific approach
    if (isMobile) {
      if (isListening) {
        // If already listening, try to stop via the ref
        if (recognitionRef.current) {
          try {
            recognitionRef.current.stop();
          } catch (e) {
            console.error('Error stopping recognition:', e);
          }
        }
        setIsListening(false);
      } else {
        // Use mobile-specific function
        startMobileSpeechRecognition();
        return;
      }
    }

    if (!isVoiceSupported) {
      // Provide more detailed browser advice, especially for mobile
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      let browserAdvice = "Try Chrome or Edge.";
      
      if (isMobile) {
        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
          browserAdvice = "On iOS, try Safari with iOS 14.5+ or Chrome.";
        } else {
          browserAdvice = "On Android, try Chrome or Samsung Internet.";
        }
        // Show help dialog for mobile users
        setShowVoiceHelp(true);
      }
      
      toast({
        title: "Voice Input Not Supported",
        description: `Your browser doesn't support voice input. ${browserAdvice}`,
        variant: "destructive",
      });
      return;
    }
    
    if (isListening) {
      // Stop listening
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Start listening with better error handling
      try {
        recognitionRef.current?.start();
        setIsListening(true);
        
        // Focus the textarea
        textareaRef.current?.focus();
        
        toast({
          title: "Voice Input Activated",
          description: "Speak now. Click the microphone again to stop.",
          variant: "default",
        });
      } catch (err) {
        console.error("Error starting speech recognition:", err);
        
        toast({
          title: "Voice Input Error",
          description: "Could not start voice input. Please check microphone permissions and try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Toggle between normal and speech input type (as fallback for unsupported browsers)
  const toggleSpeechInputType = () => {
    setUsingSpeechInputType(prev => !prev);
    
    if (!usingSpeechInputType) {
      toast({
        title: "Alternative Voice Input",
        description: "Tap on the text field and use your keyboard's microphone button",
        variant: "default",
      });
      
      // Focus the input after a short delay to let the toast appear
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 500);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isGenerating) {
      // Stop listening if active
      if (isListening) {
        recognitionRef.current?.stop();
        setIsListening(false);
      }
      
      onSendMessage(message);
      setMessage("");
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea with better scrolling behavior
    if (textareaRef.current) {
      // Reset height to auto first to properly calculate new height
      textareaRef.current.style.height = "auto";
      
      // Set a min-height of 56px and max of 200px
      const newHeight = Math.min(Math.max(56, textareaRef.current.scrollHeight), 200);
      textareaRef.current.style.height = `${newHeight}px`;
      
      // If content is larger than max height, enable scrolling
      if (textareaRef.current.scrollHeight > 200) {
        textareaRef.current.style.overflowY = "auto";
      } else {
        textareaRef.current.style.overflowY = "hidden";
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 bg-white/90 backdrop-blur-lg border-t border-gray-200 px-2 sm:px-4 py-2 sm:py-4 shadow-lg flex justify-center">
      {showVoiceHelp && (
        <div className="absolute top-0 left-0 right-0 transform -translate-y-full bg-white p-3 shadow-lg border-t border-gray-200 text-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-gray-900">Voice Input Help</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 w-6 p-0" 
              onClick={() => setShowVoiceHelp(false)}
            >
              ✕
            </Button>
          </div>
          
          {isMobile && isIOS ? (
            <div className="space-y-2">
              <p>On iOS devices:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Make sure you're using Safari (iOS 14.5+)</li>
                <li>Go to Settings &gt; Safari &gt; Microphone</li>
                <li>Ensure microphone access is granted for this website</li>
                <li>Return to the app and try again</li>
                <li className="font-medium">Alternative: Tap "Use keyboard mic" below, then use the microphone button on your keyboard</li>
              </ol>
              <div className="mt-3">
                <Button 
                  size="sm"
                  variant="outline" 
                  onClick={() => {
                    toggleSpeechInputType();
                    setShowVoiceHelp(false);
                  }}
                  className="w-full"
                >
                  Use keyboard mic instead
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p>On Android devices:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>Use Chrome or Samsung Internet browser</li>
                <li>Tap the lock icon in the address bar</li>
                <li>Ensure microphone permissions are set to "Allow"</li>
                <li>If denied before, tap "Clear & Reset" then try again</li>
                <li className="font-medium">Alternative: Tap "Use keyboard mic" below, then use the microphone button on your keyboard</li>
              </ol>
              <div className="mt-3">
                <Button 
                  size="sm"
                  variant="outline" 
                  onClick={() => {
                    toggleSpeechInputType();
                    setShowVoiceHelp(false);
                  }}
                  className="w-full"
                >
                  Use keyboard mic instead
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="w-full max-w-4xl">
        <form onSubmit={handleSubmit} className="relative">
          <div className={cn(
            "transition-all duration-300 ease-in-out rounded-xl sm:rounded-2xl",
            "border shadow-sm",
            isFocused ? "border-primary/50 shadow-md ring-2 ring-primary/20" : "border-gray-200",
            isGenerating && "bg-gray-50/50 border-accent/30 ring-accent/20"
          )}>
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={isGenerating ? "Abhimanyu is thinking..." : "Ask Abhimanyu anything..."}
              disabled={isGenerating}
              className={cn(
                "w-full px-3 sm:px-5 py-2 sm:py-3 pr-10 sm:pr-16 rounded-xl sm:rounded-2xl focus:outline-none resize-none transition-colors",
                "border-0 focus:ring-0 shadow-none min-h-[46px] sm:min-h-[56px] text-sm sm:text-base",
                isGenerating && "bg-transparent text-muted-foreground"
              )}
              rows={1}
              // Use speech input as an HTML attribute instead of props spreading for browser compatibility
              {...(usingSpeechInputType ? { inputMode: "text" } : {})}
            />
            
            {/* Action buttons - make more touch-friendly on mobile */}
            <div className="flex items-center justify-between px-2 sm:px-3 py-1.5 sm:py-2 border-t border-gray-100">
              <div className="flex space-x-1 sm:space-x-1.5">
                {/* Only show action buttons if not generating */}
                {!isGenerating && (
                  <>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={usingSpeechInputType ? toggleSpeechInputType : toggleListening}
                      className={cn(
                        "w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-colors",
                        isListening ? "bg-red-100 text-red-600 hover:bg-red-200" : 
                        usingSpeechInputType ? "bg-green-100 text-green-600 hover:bg-green-200" :
                        "text-gray-500 hover:bg-gray-100"
                      )}
                      title={usingSpeechInputType ? "Using keyboard mic (click to switch back)" : isListening ? "Stop voice input" : "Start voice input"}
                    >
                      {isListening ? <MicOff className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <Mic className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
                    </Button>
                    
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full text-gray-500 hover:bg-gray-100 hidden sm:flex"
                      title="Upload image (coming soon)"
                      disabled
                    >
                      <ImagePlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </Button>
                  </>
                )}
              </div>
              
              <div className="flex items-center gap-1 sm:gap-2">
                {isGenerating && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 sm:h-8 px-2 sm:px-3 text-xs sm:text-sm font-medium rounded-lg border border-gray-300 text-gray-700"
                  >
                    Stop generating
                  </Button>
                )}
                
                <Button
                  type="submit"
                  size="icon"
                  disabled={!message.trim() || isGenerating}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary hover:bg-primary/90 text-white"
                  title="Send message"
                >
                  <SendIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </form>
        
        <div className="flex items-center justify-between mt-3">
          <span 
            className="text-xs text-accent underline cursor-pointer" 
            onClick={() => setShowVoiceHelp(prev => !prev)}
          >
            Voice input help
          </span>
          
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Sparkles className="h-3 w-3 text-accent" />
            <span>powered by electroblazze</span>
          </div>
        </div>
      </div>
    </div>
  );
}
