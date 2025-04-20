"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function SafetySettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    enableContentFiltering: true,
    blockHateSpeech: true,
    blockViolentContent: true,
    blockExplicitContent: true,
    blockHarassment: true,
    blockSpam: true,
    filteringStrength: 75,
    enableSafetyNotifications: true,
    enableSafetyReports: true,
  })

  const handleSwitchChange = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleSliderChange = (value: number[]) => {
    setSettings((prev) => ({
      ...prev,
      filteringStrength: value[0],
    }))
  }

  const handleSave = () => {
    // In a real app, you would call your API to save the settings
    toast({
      title: "Settings saved",
      description: "Your safety settings have been saved successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Safety Settings</CardTitle>
        <CardDescription>Configure your content filtering and safety preferences.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="enable-content-filtering" className="flex flex-col gap-1">
              <span>Enable Content Filtering</span>
              <span className="text-xs text-muted-foreground">Use AI to filter out harmful content from your feed</span>
            </Label>
            <Switch
              id="enable-content-filtering"
              checked={settings.enableContentFiltering}
              onCheckedChange={() => handleSwitchChange("enableContentFiltering")}
            />
          </div>

          {settings.enableContentFiltering && (
            <div className="space-y-4 rounded-md border p-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="block-hate-speech" className="flex flex-col gap-1">
                  <span>Block Hate Speech</span>
                  <span className="text-xs text-muted-foreground">
                    Filter out content containing hate speech or discrimination
                  </span>
                </Label>
                <Switch
                  id="block-hate-speech"
                  checked={settings.blockHateSpeech}
                  onCheckedChange={() => handleSwitchChange("blockHateSpeech")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="block-violent-content" className="flex flex-col gap-1">
                  <span>Block Violent Content</span>
                  <span className="text-xs text-muted-foreground">
                    Filter out content containing violence or graphic imagery
                  </span>
                </Label>
                <Switch
                  id="block-violent-content"
                  checked={settings.blockViolentContent}
                  onCheckedChange={() => handleSwitchChange("blockViolentContent")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="block-explicit-content" className="flex flex-col gap-1">
                  <span>Block Explicit Content</span>
                  <span className="text-xs text-muted-foreground">
                    Filter out content containing explicit or adult material
                  </span>
                </Label>
                <Switch
                  id="block-explicit-content"
                  checked={settings.blockExplicitContent}
                  onCheckedChange={() => handleSwitchChange("blockExplicitContent")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="block-harassment" className="flex flex-col gap-1">
                  <span>Block Harassment</span>
                  <span className="text-xs text-muted-foreground">
                    Filter out content containing harassment or bullying
                  </span>
                </Label>
                <Switch
                  id="block-harassment"
                  checked={settings.blockHarassment}
                  onCheckedChange={() => handleSwitchChange("blockHarassment")}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="block-spam" className="flex flex-col gap-1">
                  <span>Block Spam</span>
                  <span className="text-xs text-muted-foreground">
                    Filter out content that is likely spam or misleading
                  </span>
                </Label>
                <Switch
                  id="block-spam"
                  checked={settings.blockSpam}
                  onCheckedChange={() => handleSwitchChange("blockSpam")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="filtering-strength">Filtering Strength: {settings.filteringStrength}%</Label>
                <Slider
                  id="filtering-strength"
                  min={0}
                  max={100}
                  step={1}
                  value={[settings.filteringStrength]}
                  onValueChange={handleSliderChange}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Less strict</span>
                  <span>More strict</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Safety Notifications</h3>

          <div className="flex items-center justify-between">
            <Label htmlFor="enable-safety-notifications" className="flex flex-col gap-1">
              <span>Enable Safety Notifications</span>
              <span className="text-xs text-muted-foreground">Receive notifications about potential safety issues</span>
            </Label>
            <Switch
              id="enable-safety-notifications"
              checked={settings.enableSafetyNotifications}
              onCheckedChange={() => handleSwitchChange("enableSafetyNotifications")}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="enable-safety-reports" className="flex flex-col gap-1">
              <span>Enable Safety Reports</span>
              <span className="text-xs text-muted-foreground">Receive weekly reports about filtered content</span>
            </Label>
            <Switch
              id="enable-safety-reports"
              checked={settings.enableSafetyReports}
              onCheckedChange={() => handleSwitchChange("enableSafetyReports")}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Settings</Button>
      </CardFooter>
    </Card>
  )
}
