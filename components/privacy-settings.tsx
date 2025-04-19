"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export function PrivacySettings() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    accountPrivacy: "public",
    showOnlineStatus: true,
    allowTagging: true,
    allowDirectMessages: "followers",
    showActivityStatus: true,
  })

  const handleSwitchChange = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const handleRadioChange = (key: keyof typeof settings, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = () => {
    // In a real app, you would call your API to save the settings
    toast({
      title: "Settings saved",
      description: "Your privacy settings have been saved successfully.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>Control your privacy and visibility on the platform.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Account Privacy</Label>
          <RadioGroup
            value={settings.accountPrivacy}
            onValueChange={(value) => handleRadioChange("accountPrivacy", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="public" id="public" />
              <Label htmlFor="public" className="font-normal">
                Public - Anyone can see your profile and posts
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="private" id="private" />
              <Label htmlFor="private" className="font-normal">
                Private - Only approved followers can see your profile and posts
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="show-online-status" className="flex flex-col gap-1">
              <span>Show Online Status</span>
              <span className="text-xs text-muted-foreground">
                Allow others to see when you're active on the platform
              </span>
            </Label>
            <Switch
              id="show-online-status"
              checked={settings.showOnlineStatus}
              onCheckedChange={() => handleSwitchChange("showOnlineStatus")}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="allow-tagging" className="flex flex-col gap-1">
              <span>Allow Tagging</span>
              <span className="text-xs text-muted-foreground">Allow others to tag you in posts and comments</span>
            </Label>
            <Switch
              id="allow-tagging"
              checked={settings.allowTagging}
              onCheckedChange={() => handleSwitchChange("allowTagging")}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-activity-status" className="flex flex-col gap-1">
              <span>Show Activity Status</span>
              <span className="text-xs text-muted-foreground">Allow others to see your recent activity</span>
            </Label>
            <Switch
              id="show-activity-status"
              checked={settings.showActivityStatus}
              onCheckedChange={() => handleSwitchChange("showActivityStatus")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Direct Messages</Label>
          <RadioGroup
            value={settings.allowDirectMessages}
            onValueChange={(value) => handleRadioChange("allowDirectMessages", value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="everyone" id="everyone" />
              <Label htmlFor="everyone" className="font-normal">
                Everyone can send you direct messages
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="followers" id="followers" />
              <Label htmlFor="followers" className="font-normal">
                Only people you follow can send you direct messages
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="nobody" id="nobody" />
              <Label htmlFor="nobody" className="font-normal">
                Nobody can send you direct messages
              </Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave}>Save Settings</Button>
      </CardFooter>
    </Card>
  )
}
