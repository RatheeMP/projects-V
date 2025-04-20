"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Sliders } from "lucide-react"
import { useState } from "react"

export function FeedFilter() {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState({
    hideViolentContent: true,
    hideHateSpeech: true,
    hideExplicitContent: true,
    hideSpam: true,
    hidePoliticalContent: false,
    hideCommercialContent: false,
  })

  const handleFilterChange = (key: keyof typeof filters) => {
    setFilters((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Your Feed</CardTitle>
            <CardDescription>Customize what you see in your feed</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Sliders className="h-4 w-4" />
                <span className="sr-only">Filter feed</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Feed Preferences</DialogTitle>
                <DialogDescription>Choose what type of content you want to see in your feed.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-violent-content" className="flex flex-col gap-1">
                    <span>Hide Violent Content</span>
                    <span className="text-xs text-muted-foreground">
                      Filter out posts containing violence or graphic content
                    </span>
                  </Label>
                  <Switch
                    id="hide-violent-content"
                    checked={filters.hideViolentContent}
                    onCheckedChange={() => handleFilterChange("hideViolentContent")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-hate-speech" className="flex flex-col gap-1">
                    <span>Hide Hate Speech</span>
                    <span className="text-xs text-muted-foreground">
                      Filter out posts containing hate speech or discrimination
                    </span>
                  </Label>
                  <Switch
                    id="hide-hate-speech"
                    checked={filters.hideHateSpeech}
                    onCheckedChange={() => handleFilterChange("hideHateSpeech")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-explicit-content" className="flex flex-col gap-1">
                    <span>Hide Explicit Content</span>
                    <span className="text-xs text-muted-foreground">
                      Filter out posts containing explicit or adult content
                    </span>
                  </Label>
                  <Switch
                    id="hide-explicit-content"
                    checked={filters.hideExplicitContent}
                    onCheckedChange={() => handleFilterChange("hideExplicitContent")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-spam" className="flex flex-col gap-1">
                    <span>Hide Spam</span>
                    <span className="text-xs text-muted-foreground">
                      Filter out posts that are likely spam or misleading
                    </span>
                  </Label>
                  <Switch
                    id="hide-spam"
                    checked={filters.hideSpam}
                    onCheckedChange={() => handleFilterChange("hideSpam")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-political-content" className="flex flex-col gap-1">
                    <span>Hide Political Content</span>
                    <span className="text-xs text-muted-foreground">Filter out posts related to politics</span>
                  </Label>
                  <Switch
                    id="hide-political-content"
                    checked={filters.hidePoliticalContent}
                    onCheckedChange={() => handleFilterChange("hidePoliticalContent")}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="hide-commercial-content" className="flex flex-col gap-1">
                    <span>Hide Commercial Content</span>
                    <span className="text-xs text-muted-foreground">
                      Filter out posts that are advertisements or promotions
                    </span>
                  </Label>
                  <Switch
                    id="hide-commercial-content"
                    checked={filters.hideCommercialContent}
                    onCheckedChange={() => handleFilterChange("hideCommercialContent")}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button onClick={() => setOpen(false)}>Save preferences</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {filters.hideViolentContent && (
            <div className="rounded-full bg-muted px-3 py-1 text-xs">Violent content hidden</div>
          )}
          {filters.hideHateSpeech && <div className="rounded-full bg-muted px-3 py-1 text-xs">Hate speech hidden</div>}
          {filters.hideExplicitContent && (
            <div className="rounded-full bg-muted px-3 py-1 text-xs">Explicit content hidden</div>
          )}
          {filters.hideSpam && <div className="rounded-full bg-muted px-3 py-1 text-xs">Spam hidden</div>}
          {filters.hidePoliticalContent && (
            <div className="rounded-full bg-muted px-3 py-1 text-xs">Political content hidden</div>
          )}
          {filters.hideCommercialContent && (
            <div className="rounded-full bg-muted px-3 py-1 text-xs">Commercial content hidden</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
