import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SafetySettings } from "@/components/safety-settings"
import { AccountSettings } from "@/components/account-settings"
import { PrivacySettings } from "@/components/privacy-settings"

export default function SettingsPage() {
  return (
    <div className="py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences.</p>
      </div>
      <Tabs defaultValue="account">
        <TabsList className="mb-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="safety">Safety</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountSettings />
        </TabsContent>
        <TabsContent value="safety">
          <SafetySettings />
        </TabsContent>
        <TabsContent value="privacy">
          <PrivacySettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
