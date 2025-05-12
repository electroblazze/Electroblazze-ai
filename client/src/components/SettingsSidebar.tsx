import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ModelSettings } from "@/lib/types";

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
      className={`w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0 transition-all duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full hidden"
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Model Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5 text-gray-500" />
          </Button>
        </div>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="temperature" className="text-sm font-medium text-gray-700">
              Temperature
            </Label>
            <span className="text-sm text-gray-700">{settings.temperature}</span>
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
          <p className="text-xs text-gray-500">
            Controls randomness (0 = deterministic, 1 = creative)
          </p>
        </div>

        {/* Top P */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="top_p" className="text-sm font-medium text-gray-700">
              Top P
            </Label>
            <span className="text-sm text-gray-700">{settings.top_p}</span>
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
          <p className="text-xs text-gray-500">
            Controls diversity via nucleus sampling
          </p>
        </div>

        {/* Max Tokens */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="max_tokens" className="text-sm font-medium text-gray-700">
              Max Tokens
            </Label>
            <span className="text-sm text-gray-700">{settings.max_tokens}</span>
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
          <p className="text-xs text-gray-500">Maximum tokens in response</p>
        </div>

        {/* Frequency Penalty */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="frequency_penalty" className="text-sm font-medium text-gray-700">
              Frequency Penalty
            </Label>
            <span className="text-sm text-gray-700">{settings.frequency_penalty}</span>
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
          <p className="text-xs text-gray-500">Reduces repetition of tokens</p>
        </div>

        {/* Presence Penalty */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="presence_penalty" className="text-sm font-medium text-gray-700">
              Presence Penalty
            </Label>
            <span className="text-sm text-gray-700">{settings.presence_penalty}</span>
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
          <p className="text-xs text-gray-500">
            Reduces likelihood of discussing new topics
          </p>
        </div>

        <Separator className="my-4" />

        <Button
          variant="outline"
          className="w-full"
          onClick={onResetSettings}
        >
          Reset to Defaults
        </Button>
      </div>
    </aside>
  );
}
