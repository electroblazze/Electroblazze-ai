import { useEffect, useState } from "react";
import { X, Thermometer, Sparkles, Timer, Repeat, Zap, RotateCcw, BrainCircuit, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ModelSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ModelSettings;
  onUpdateSettings: (settings: Partial<ModelSettings>) => void;
  onResetSettings: () => void;
}

export default function SettingsSidebar({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}: SettingsSidebarProps) {
  const [activeTab, setActiveTab] = useState<"basic" | "advanced">("basic");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  const handleSliderChange = (key: keyof ModelSettings, value: number[]) => {
    onUpdateSettings({ [key]: value[0] });
  };

  return (
    <aside
      className={`fixed inset-y-0 right-0 w-96 bg-white/95 backdrop-blur-md border-l border-gray-200 overflow-hidden flex-shrink-0 z-50 shadow-2xl transition-all duration-500 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-gradient">
                AI Model Settings
              </h2>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Customize how Nemotron Ultra generates responses
          </p>
          
          <div className="flex mt-4 border rounded-lg overflow-hidden">
            <Button 
              variant="ghost"
              onClick={() => setActiveTab("basic")}
              className={cn(
                "flex-1 rounded-none py-2 border-0",
                activeTab === "basic" ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              Basic
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setActiveTab("advanced")}
              className={cn(
                "flex-1 rounded-none py-2 border-0",
                activeTab === "advanced" ? "bg-primary/10 text-primary" : "text-muted-foreground"
              )}
            >
              Advanced
            </Button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {activeTab === "basic" ? (
            <>
              {/* Temperature */}
              <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Thermometer className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">Temperature</CardTitle>
                  </div>
                  <CardDescription>Controls response randomness and creativity</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Precise</span>
                    </div>
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      {settings.temperature.toFixed(1)}
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">Creative</span>
                    </div>
                  </div>
                  <Slider
                    id="temperature"
                    min={0}
                    max={1}
                    step={0.1}
                    value={[settings.temperature]}
                    onValueChange={(value) => handleSliderChange("temperature", value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Top P */}
              <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Sparkles className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">Top P</CardTitle>
                  </div>
                  <CardDescription>Controls diversity via nucleus sampling</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Focused</span>
                    </div>
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      {settings.top_p.toFixed(2)}
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">Diverse</span>
                    </div>
                  </div>
                  <Slider
                    id="top_p"
                    min={0}
                    max={1}
                    step={0.05}
                    value={[settings.top_p]}
                    onValueChange={(value) => handleSliderChange("top_p", value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Max Tokens */}
              <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Timer className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">Max Tokens</CardTitle>
                  </div>
                  <CardDescription>Controls maximum output length</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Shorter</span>
                    </div>
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      {settings.max_tokens}
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">Longer</span>
                    </div>
                  </div>
                  <Slider
                    id="max_tokens"
                    min={256}
                    max={8192}
                    step={256}
                    value={[settings.max_tokens]}
                    onValueChange={(value) => handleSliderChange("max_tokens", value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {/* Frequency Penalty */}
              <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Repeat className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">Frequency Penalty</CardTitle>
                  </div>
                  <CardDescription>Penalizes words that appear frequently</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Repetitive</span>
                    </div>
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      {settings.frequency_penalty.toFixed(1)}
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">Varied</span>
                    </div>
                  </div>
                  <Slider
                    id="frequency_penalty"
                    min={-2}
                    max={2}
                    step={0.1}
                    value={[settings.frequency_penalty]}
                    onValueChange={(value) => handleSliderChange("frequency_penalty", value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>

              {/* Presence Penalty */}
              <Card className="border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 py-4">
                  <div className="flex items-center space-x-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Zap className="h-4 w-4 text-primary" />
                    </div>
                    <CardTitle className="text-base font-semibold">Presence Penalty</CardTitle>
                  </div>
                  <CardDescription>Encourages discussing new topics</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">Focused</span>
                    </div>
                    <span className="text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      {settings.presence_penalty.toFixed(1)}
                    </span>
                    <div className="flex items-center">
                      <span className="text-xs px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">Exploratory</span>
                    </div>
                  </div>
                  <Slider
                    id="presence_penalty"
                    min={-2}
                    max={2}
                    step={0.1}
                    value={[settings.presence_penalty]}
                    onValueChange={(value) => handleSliderChange("presence_penalty", value)}
                    className="w-full"
                  />
                </CardContent>
              </Card>
            </>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-5 border-t border-gray-200">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center space-x-2 hover:bg-gray-50"
            onClick={onResetSettings}
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset to Defaults</span>
          </Button>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Powered by NVIDIA's Llama 3.1 Nemotron Ultra (253B)
          </p>
        </div>
      </div>
    </aside>
  );
}
