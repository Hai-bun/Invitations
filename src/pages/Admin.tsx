import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Palette,
  Heart,
  Calendar,
  MapPin,
  Camera,
  Gift,
  Copy,
  Trash2,
  Plus,
  ExternalLink,
  Save,
  Check,
  MessageSquare,
  Layout,
  Bot,
  Share2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  getWeddingData,
  saveWeddingData,
  addGuest,
  deleteGuest,
  WeddingData,
  Guest,
  RSVPResponse,
  TemplateType,
} from "@/lib/weddingStore";
import { uploadWeddingImage, deleteWeddingImage } from "@/lib/storage";
import { ThemeSelector } from "@/components/admin/ThemeSelector";
import { TemplateSelector } from "@/components/admin/TemplateSelector";
import { ThemeType, applyTheme } from "@/lib/themeConfig";

const Admin = () => {
  const [data, setData] = useState<WeddingData | null>(null);
  const [newGuestName, setNewGuestName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadWeddingData = async () => {
      const weddingData = await getWeddingData();
      setData(weddingData);
    };

    loadWeddingData();
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    const success = await saveWeddingData(data);
    setIsSaving(false);
    if (success) {
      toast.success("Settings saved successfully!");
      // Reload data from database to ensure persistence
      const updated = await getWeddingData();
      setData(updated);
    } else {
      toast.error("Failed to save settings. Please try again.");
    }
  };

  const handleAddGuest = async () => {
    if (!newGuestName.trim() || !data) {
      toast.error("Please enter a guest name");
      return;
    }

    const guest = await addGuest(newGuestName.trim());
    if (!guest) {
      toast.error("Unable to add guest. Please try again.");
      return;
    }

    setData({ ...data, guests: [...data.guests, guest] });
    setNewGuestName("");
    toast.success("Guest added successfully!");
  };

  const handleDeleteGuest = async (id: string) => {
    if (!data) return;
    const success = await deleteGuest(id);
    if (!success) {
      toast.error("Unable to remove guest. Please try again.");
      return;
    }

    setData({ ...data, guests: data.guests.filter((g) => g.id !== id) });
    toast.success("Guest removed");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  const MAX_IMAGE_BYTES = Infinity; // no client-side size limit
  const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  const validateImageFile = (file: File): boolean => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error(
        `${file.name}: only JPEG, PNG, WebP, or GIF images are allowed`,
      );
      return false;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      toast.error(`${file.name}: file exceeds the 5MB limit`);
      return false;
    }
    return true;
  };

  // Verify the file's real content matches an allowed image magic-number signature.
  const verifyImageMagicBytes = (file: File): Promise<boolean> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onerror = () => resolve(false);
      reader.onload = () => {
        const buf = reader.result as ArrayBuffer;
        const b = new Uint8Array(buf);
        const isJpeg = b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
        const isPng =
          b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
        const isGif = b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46;
        const isWebp =
          b[0] === 0x52 &&
          b[1] === 0x49 &&
          b[2] === 0x46 &&
          b[3] === 0x46 &&
          b[8] === 0x57 &&
          b[9] === 0x45 &&
          b[10] === 0x42 &&
          b[11] === 0x50;
        resolve(isJpeg || isPng || isGif || isWebp);
      };
      reader.readAsArrayBuffer(file.slice(0, 12));
    });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of Array.from(files)) {
      if (!validateImageFile(file)) continue;
      if (!(await verifyImageMagicBytes(file))) {
        toast.error(`${file.name}: file content is not a valid image`);
        continue;
      }
      const publicUrl = await uploadWeddingImage(file, "photos");
      if (!publicUrl) {
        toast.error(`${file.name}: upload failed`);
        continue;
      }
      setData((prev) => ({ ...prev, photos: [...prev.photos, publicUrl] }));
    }
    e.target.value = "";
  };

  const handleKHQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!validateImageFile(file)) {
      e.target.value = "";
      return;
    }
    if (!(await verifyImageMagicBytes(file))) {
      toast.error(`${file.name}: file content is not a valid image`);
      e.target.value = "";
      return;
    }
    const publicUrl = await uploadWeddingImage(file, "khqr");
    if (!publicUrl) {
      toast.error(`${file.name}: upload failed`);
      e.target.value = "";
      return;
    }
    if (data.khqrImage) {
      await deleteWeddingImage(data.khqrImage);
    }
    setData((prev) => ({ ...prev, khqrImage: publicUrl }));
    e.target.value = "";
  };

  const removePhoto = async (index: number) => {
    const photoUrl = data.photos[index];
    if (photoUrl) {
      await deleteWeddingImage(photoUrl);
    }
    setData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  const testTelegramBot = async () => {
    if (!data.telegramConfig.botToken || !data.telegramConfig.chatId) {
      toast.error("Please enter bot token and chat ID first");
      return;
    }

    try {
      const response = await fetch(
        `https://api.telegram.org/bot${data.telegramConfig.botToken}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: data.telegramConfig.chatId,
            text: "🎉 *Test Message*\n\nYour Telegram bot is configured correctly! RSVP responses will be sent here.",
            parse_mode: "Markdown",
          }),
        },
      );

      if (response.ok) {
        toast.success("Test message sent! Check your Telegram.");
      } else {
        toast.error(
          "Failed to send test message. Check your token and chat ID.",
        );
      }
    } catch {
      toast.error("Failed to connect to Telegram API");
    }
  };

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          Loading wedding settings...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-primary" fill="currentColor" />
            <div>
              <h1 className="font-serif text-xl font-semibold text-foreground">
                Wedding Admin
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage your invitation
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.open("/wedding", "_blank")}
              className="hidden sm:flex">
              <ExternalLink className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary/90">
              {isSaving ? (
                <Check className="w-4 h-4 mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              {isSaving ? "Saved!" : "Save"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="guests" className="space-y-6">
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-12 gap-2 h-auto bg-transparent">
            <TabsTrigger
              value="guests"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Users className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Guests</span>
            </TabsTrigger>
            <TabsTrigger
              value="template"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Layout className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Template</span>
            </TabsTrigger>
            <TabsTrigger
              value="theme"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Palette className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Theme</span>
            </TabsTrigger>
            <TabsTrigger
              value="animations"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Animations</span>
            </TabsTrigger>
            <TabsTrigger
              value="couple"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Heart className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Couple</span>
            </TabsTrigger>
            <TabsTrigger
              value="date"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Date</span>
            </TabsTrigger>
            <TabsTrigger
              value="location"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Location</span>
            </TabsTrigger>
            <TabsTrigger
              value="photos"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Camera className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Photos</span>
            </TabsTrigger>
            <TabsTrigger
              value="gift"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Gift className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Gift</span>
            </TabsTrigger>
            <TabsTrigger
              value="social"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Share2 className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Social</span>
            </TabsTrigger>
            <TabsTrigger
              value="telegram"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Bot className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Telegram</span>
            </TabsTrigger>
            <TabsTrigger
              value="responses"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <MessageSquare className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">RSVPs</span>
            </TabsTrigger>
          </TabsList>

          {/* Guests Tab */}
          <TabsContent value="guests">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Guest Management</CardTitle>
                <CardDescription>
                  Create and manage guest invitation links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Guest */}
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter guest name (e.g., Mr. Sok Dara)"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddGuest()}
                  />
                  <Button
                    onClick={handleAddGuest}
                    className="bg-primary hover:bg-primary/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Add
                  </Button>
                </div>

                {/* Guest List */}
                <div className="space-y-3">
                  {data.guests.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No guests added yet. Add your first guest above.
                    </p>
                  ) : (
                    data.guests.map((guest: Guest) => (
                      <div
                        key={guest.id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {guest.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {guest.inviteUrl}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(guest.inviteUrl)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              window.open(guest.inviteUrl, "_blank")
                            }>
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteGuest(guest.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Template Tab */}
          <TabsContent value="template">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">
                  Invitation Template
                </CardTitle>
                <CardDescription>
                  Choose a professional template layout for your invitation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <TemplateSelector
                  selectedTemplate={data.template}
                  onTemplateChange={(template) => {
                    setData({ ...data, template });
                    toast.success(`Template changed to ${template}`);
                  }}
                />

                {/* Welcome Popup Settings */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="font-medium text-foreground">Welcome Popup</h3>
                  <div className="flex items-center space-x-3">
                    <Switch
                      id="welcomePopupEnabled"
                      checked={data.welcomePopupEnabled}
                      onCheckedChange={(checked) =>
                        setData({ ...data, welcomePopupEnabled: checked })
                      }
                    />
                    <Label htmlFor="welcomePopupEnabled">
                      Show welcome popup when guests open invitation
                    </Label>
                  </div>

                  {data.welcomePopupEnabled && (
                    <div className="space-y-2">
                      <Label htmlFor="welcomePopupMessage">Popup Message</Label>
                      <Textarea
                        id="welcomePopupMessage"
                        value={data.welcomePopupMessage}
                        onChange={(e) =>
                          setData({
                            ...data,
                            welcomePopupMessage: e.target.value,
                          })
                        }
                        placeholder="Welcome message for guests..."
                        rows={3}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Theme Tab */}
          <TabsContent value="theme">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Theme & Style</CardTitle>
                <CardDescription>
                  Choose a visual theme for your wedding invitation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ThemeSelector
                  selectedTheme={data.theme as ThemeType}
                  onThemeChange={(theme) => {
                    setData({ ...data, theme });
                    applyTheme(theme);
                    toast.success(`Theme changed to ${theme}`);
                  }}
                />

                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Tip:</strong> Preview your invitation to see how the
                    theme looks. Click the "Preview" button in the header to
                    open a new tab with your invitation.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Animations Tab */}
          <TabsContent value="animations">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Animations</CardTitle>
                <CardDescription>
                  Control the motion and effects shown on your wedding
                  invitation page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
                  <div>
                    <Label className="text-base">Enable animations</Label>
                    <p className="text-sm text-muted-foreground">
                      Master switch — turn off all motion for a static
                      invitation
                    </p>
                  </div>
                  <Switch
                    checked={data.animations.enabled}
                    onCheckedChange={(v) =>
                      setData({
                        ...data,
                        animations: { ...data.animations, enabled: v },
                      })
                    }
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Floating petals</Label>
                      <p className="text-xs text-muted-foreground">
                        Rose petals drifting down
                      </p>
                    </div>
                    <Switch
                      disabled={!data.animations.enabled}
                      checked={data.animations.floatingPetals}
                      onCheckedChange={(v) =>
                        setData({
                          ...data,
                          animations: { ...data.animations, floatingPetals: v },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Heartbeat</Label>
                      <p className="text-xs text-muted-foreground">
                        Pulsing heart between names
                      </p>
                    </div>
                    <Switch
                      disabled={!data.animations.enabled}
                      checked={data.animations.heartbeat}
                      onCheckedChange={(v) =>
                        setData({
                          ...data,
                          animations: { ...data.animations, heartbeat: v },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Fade-in reveals</Label>
                      <p className="text-xs text-muted-foreground">
                        Content fades up as it appears
                      </p>
                    </div>
                    <Switch
                      disabled={!data.animations.enabled}
                      checked={data.animations.fadeInOnScroll}
                      onCheckedChange={(v) =>
                        setData({
                          ...data,
                          animations: { ...data.animations, fadeInOnScroll: v },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Photo hover zoom</Label>
                      <p className="text-xs text-muted-foreground">
                        Gallery photos zoom on hover
                      </p>
                    </div>
                    <Switch
                      disabled={!data.animations.enabled}
                      checked={data.animations.photoHoverZoom}
                      onCheckedChange={(v) =>
                        setData({
                          ...data,
                          animations: { ...data.animations, photoHoverZoom: v },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <Label>Scroll indicator</Label>
                      <p className="text-xs text-muted-foreground">
                        Floating hint at bottom of hero
                      </p>
                    </div>
                    <Switch
                      disabled={!data.animations.enabled}
                      checked={data.animations.heroFloatIndicator}
                      onCheckedChange={(v) =>
                        setData({
                          ...data,
                          animations: {
                            ...data.animations,
                            heroFloatIndicator: v,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <Label>Animation speed</Label>
                  <div className="flex gap-2">
                    {(["slow", "normal", "fast"] as const).map((s) => (
                      <Button
                        key={s}
                        type="button"
                        variant={
                          data.animations.speed === s ? "default" : "outline"
                        }
                        size="sm"
                        disabled={!data.animations.enabled}
                        onClick={() =>
                          setData({
                            ...data,
                            animations: { ...data.animations, speed: s },
                          })
                        }
                        className="capitalize">
                        {s}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Couple Info Tab */}

          <TabsContent value="couple">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Couple Information</CardTitle>
                <CardDescription>
                  Enter the names of the couple and their families
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="groomName">Groom's Full Name</Label>
                    <Input
                      id="groomName"
                      value={data.groomName}
                      onChange={(e) =>
                        setData({ ...data, groomName: e.target.value })
                      }
                      placeholder="Enter groom's name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brideName">Bride's Full Name</Label>
                    <Input
                      id="brideName"
                      value={data.brideName}
                      onChange={(e) =>
                        setData({ ...data, brideName: e.target.value })
                      }
                      placeholder="Enter bride's name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="groomParents">Groom's Parents</Label>
                    <Input
                      id="groomParents"
                      value={data.groomParents}
                      onChange={(e) =>
                        setData({ ...data, groomParents: e.target.value })
                      }
                      placeholder="Mr. & Mrs. Family Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brideParents">Bride's Parents</Label>
                    <Input
                      id="brideParents"
                      value={data.brideParents}
                      onChange={(e) =>
                        setData({ ...data, brideParents: e.target.value })
                      }
                      placeholder="Mr. & Mrs. Family Name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Date Tab */}
          <TabsContent value="date">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">
                  Wedding Date & Time
                </CardTitle>
                <CardDescription>
                  Set your wedding date and countdown preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="weddingDate">Wedding Date</Label>
                    <Input
                      id="weddingDate"
                      type="date"
                      value={data.weddingDate}
                      onChange={(e) =>
                        setData({ ...data, weddingDate: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weddingTime">Wedding Time</Label>
                    <Input
                      id="weddingTime"
                      type="time"
                      value={data.weddingTime}
                      onChange={(e) =>
                        setData({ ...data, weddingTime: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Switch
                    id="showCountdown"
                    checked={data.showCountdown}
                    onCheckedChange={(checked) =>
                      setData({ ...data, showCountdown: checked })
                    }
                  />
                  <Label htmlFor="showCountdown">Show countdown timer</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Location Tab */}
          <TabsContent value="location">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Event Location</CardTitle>
                <CardDescription>
                  Set your wedding venue details with Google Maps
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="eventTitle">Event Title</Label>
                  <Input
                    id="eventTitle"
                    value={data.eventTitle}
                    onChange={(e) =>
                      setData({ ...data, eventTitle: e.target.value })
                    }
                    placeholder="Wedding Ceremony & Reception"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventAddress">Event Address</Label>
                  <Textarea
                    id="eventAddress"
                    value={data.eventAddress}
                    onChange={(e) =>
                      setData({ ...data, eventAddress: e.target.value })
                    }
                    placeholder="Enter the full venue address"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventMapUrl">Google Maps URL</Label>
                  <Input
                    id="eventMapUrl"
                    value={data.eventMapUrl}
                    onChange={(e) =>
                      setData({ ...data, eventMapUrl: e.target.value })
                    }
                    placeholder="https://maps.google.com/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Paste a Google Maps link to your venue. This will be used to
                    embed the map and provide directions.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Photos Tab */}
          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Photo Gallery</CardTitle>
                <CardDescription>
                  Upload photos for your wedding gallery
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    Drag and drop photos here, or click to browse
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="max-w-xs mx-auto"
                  />
                </div>

                {data.photos.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {data.photos.map((photo, index) => (
                      <div key={index} className="relative group aspect-square">
                        <img
                          src={photo}
                          alt={`Wedding photo ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gift Tab */}
          <TabsContent value="gift">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">
                  Wedding Gift (KHQR)
                </CardTitle>
                <CardDescription>
                  Configure your KHQR code for digital gifts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="giftEnabled"
                    checked={data.giftEnabled}
                    onCheckedChange={(checked) =>
                      setData({ ...data, giftEnabled: checked })
                    }
                  />
                  <Label htmlFor="giftEnabled">Enable gift section</Label>
                </div>

                {data.giftEnabled && (
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                      <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-4">
                        Upload your KHQR code image
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleKHQRUpload}
                        className="max-w-xs mx-auto"
                      />
                    </div>

                    {data.khqrImage && (
                      <div className="flex justify-center">
                        <div className="relative">
                          <img
                            src={data.khqrImage}
                            alt="KHQR Code"
                            className="w-48 h-48 object-contain rounded-lg border border-border"
                          />
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2"
                            onClick={async () => {
                              if (data.khqrImage) {
                                await deleteWeddingImage(data.khqrImage);
                              }
                              setData({ ...data, khqrImage: "" });
                            }}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Links Tab */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">
                  Social & Contact Links
                </CardTitle>
                <CardDescription>
                  Add your social media links for the footer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="telegram">Telegram</Label>
                    <Input
                      id="telegram"
                      value={data.socialLinks.telegram}
                      onChange={(e) =>
                        setData({
                          ...data,
                          socialLinks: {
                            ...data.socialLinks,
                            telegram: e.target.value,
                          },
                        })
                      }
                      placeholder="@username or https://t.me/username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={data.socialLinks.facebook}
                      onChange={(e) =>
                        setData({
                          ...data,
                          socialLinks: {
                            ...data.socialLinks,
                            facebook: e.target.value,
                          },
                        })
                      }
                      placeholder="username or full URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={data.socialLinks.instagram}
                      onChange={(e) =>
                        setData({
                          ...data,
                          socialLinks: {
                            ...data.socialLinks,
                            instagram: e.target.value,
                          },
                        })
                      }
                      placeholder="@username or full URL"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={data.socialLinks.whatsapp}
                      onChange={(e) =>
                        setData({
                          ...data,
                          socialLinks: {
                            ...data.socialLinks,
                            whatsapp: e.target.value,
                          },
                        })
                      }
                      placeholder="Phone number (e.g., +855123456789)"
                    />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  These links will appear in the footer of your wedding
                  invitation, allowing guests to contact you easily.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Telegram Bot Tab */}
          <TabsContent value="telegram">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">Telegram RSVP Bot</CardTitle>
                <CardDescription>
                  Receive RSVP notifications directly to your Telegram
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-3">
                  <Switch
                    id="telegramEnabled"
                    checked={data.telegramConfig.enabled}
                    onCheckedChange={(checked) =>
                      setData({
                        ...data,
                        telegramConfig: {
                          ...data.telegramConfig,
                          enabled: checked,
                        },
                      })
                    }
                  />
                  <Label htmlFor="telegramEnabled">
                    Enable Telegram notifications
                  </Label>
                </div>

                {data.telegramConfig.enabled && (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                      <h4 className="font-medium text-sm">How to set up:</h4>
                      <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                        <li>
                          Message{" "}
                          <a
                            href="https://t.me/BotFather"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline">
                            @BotFather
                          </a>{" "}
                          on Telegram to create a new bot
                        </li>
                        <li>Copy the bot token provided</li>
                        <li>
                          Start a chat with your new bot and send any message
                        </li>
                        <li>
                          Get your chat ID from{" "}
                          <a
                            href="https://t.me/userinfobot"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline">
                            @userinfobot
                          </a>
                        </li>
                      </ol>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="botToken">Bot Token</Label>
                      <Input
                        id="botToken"
                        type="password"
                        value={data.telegramConfig.botToken}
                        onChange={(e) =>
                          setData({
                            ...data,
                            telegramConfig: {
                              ...data.telegramConfig,
                              botToken: e.target.value,
                            },
                          })
                        }
                        placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chatId">Chat ID</Label>
                      <Input
                        id="chatId"
                        value={data.telegramConfig.chatId}
                        onChange={(e) =>
                          setData({
                            ...data,
                            telegramConfig: {
                              ...data.telegramConfig,
                              chatId: e.target.value,
                            },
                          })
                        }
                        placeholder="123456789"
                      />
                    </div>

                    <Button onClick={testTelegramBot} variant="outline">
                      <Bot className="w-4 h-4 mr-2" />
                      Send Test Message
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* RSVP Responses Tab */}
          <TabsContent value="responses">
            <Card>
              <CardHeader>
                <CardTitle className="font-serif">RSVP Responses</CardTitle>
                <CardDescription>
                  View guest responses and messages
                </CardDescription>
              </CardHeader>
              <CardContent>
                {data.rsvpResponses.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    No responses yet. Responses will appear here when guests
                    RSVP.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {data.rsvpResponses.map((response: RSVPResponse) => (
                      <div
                        key={response.id}
                        className="p-4 bg-muted/50 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-foreground">
                            {response.guestName}
                          </p>
                          <span
                            className={`text-sm px-2 py-1 rounded-full ${
                              response.attending
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                            {response.attending ? "Attending" : "Not Attending"}
                          </span>
                        </div>
                        {response.message && (
                          <p className="text-sm text-muted-foreground italic">
                            "{response.message}"
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(response.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
