import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type TemplateType = "classic" | "modern" | "elegant" | "romantic";

export interface SocialLinks {
  telegram: string;
  facebook: string;
  instagram: string;
  whatsapp: string;
}

export interface TelegramConfig {
  botToken: string;
  chatId: string;
  enabled: boolean;
}

export interface WeddingData {
  // Couple Information
  groomName: string;
  brideName: string;
  groomParents: string;
  brideParents: string;

  // Wedding Date & Time
  weddingDate: string;
  weddingTime: string;
  showCountdown: boolean;

  // Event Location
  eventTitle: string;
  eventAddress: string;
  eventMapUrl: string;

  // Theme Settings
  theme: "luxury" | "minimal" | "traditional" | "floral";
  template: TemplateType;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;

  // Photo Gallery
  photos: string[];

  // KHQR Gift
  khqrImage: string;
  giftEnabled: boolean;

  // Guests
  guests: Guest[];

  // RSVP Responses
  rsvpResponses: RSVPResponse[];

  // Social Links & Footer
  socialLinks: SocialLinks;

  // Telegram Bot Config
  telegramConfig: TelegramConfig;

  // Welcome Popup
  welcomePopupEnabled: boolean;
  welcomePopupMessage: string;

  // Animations
  animations: AnimationSettings;
}

export interface AnimationSettings {
  enabled: boolean;
  floatingPetals: boolean;
  heartbeat: boolean;
  fadeInOnScroll: boolean;
  photoHoverZoom: boolean;
  heroFloatIndicator: boolean;
  speed: "slow" | "normal" | "fast";
}

export interface Guest {
  id: string;
  name: string;
  inviteUrl: string;
  createdAt: string;
}

export interface RSVPResponse {
  id: string;
  guestName: string;
  attending: boolean;
  message: string;
  submittedAt: string;
}

const DEFAULT_WEDDING_ID = "default-wedding";
const DEFAULT_WEDDING_DATA: WeddingData = {
  groomName: "Sokha Virak",
  brideName: "Channary Meas",
  groomParents: "Mr. & Mrs. Virak Family",
  brideParents: "Mr. & Mrs. Meas Family",
  weddingDate: "2026-02-14",
  weddingTime: "10:00",
  showCountdown: true,
  eventTitle: "Wedding Ceremony & Reception",
  eventAddress: "Royal Palace Gardens, Phnom Penh, Cambodia",
  eventMapUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.7512345678!2d104.9282!3d11.5564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sRoyal+Palace!5e0!3m2!1sen!2skh!4v1234567890",
  theme: "luxury",
  template: "classic",
  backgroundImage: "",
  primaryColor: "#c9a87c",
  secondaryColor: "#f5e6d3",
  accentColor: "#d4a574",
  headingFont: "Cormorant Garamond",
  bodyFont: "Lato",
  photos: [],
  khqrImage: "",
  giftEnabled: true,
  guests: [],
  rsvpResponses: [],
  socialLinks: {
    telegram: "",
    facebook: "",
    instagram: "",
    whatsapp: "",
  },
  telegramConfig: {
    botToken: "",
    chatId: "",
    enabled: false,
  },
  welcomePopupEnabled: true,
  welcomePopupMessage:
    "We are delighted to share this special moment with you. Please scroll down to view our wedding invitation.",
  animations: {
    enabled: true,
    floatingPetals: true,
    heartbeat: true,
    fadeInOnScroll: true,
    photoHoverZoom: true,
    heroFloatIndicator: true,
    speed: "normal",
  },
};

const getInviteUrl = (guestId: string): string =>
  typeof window !== "undefined"
    ? `${window.location.origin}/invite/${guestId}`
    : `/invite/${guestId}`;

const mapGuestRowToGuest = (
  row: Database["public"]["Tables"]["guest_invitations"]["Row"],
): Guest => ({
  id: row.id,
  name: row.guest_name,
  inviteUrl: getInviteUrl(row.id),
  createdAt: row.created_at ?? new Date().toISOString(),
});

const mapGuestRowToResponse = (
  row: Database["public"]["Tables"]["guest_invitations"]["Row"],
): RSVPResponse => ({
  id: row.id,
  guestName: row.guest_name,
  attending: row.rsvp_status === "attending",
  message: row.blessing_message ?? "",
  submittedAt: row.updated_at ?? row.created_at ?? new Date().toISOString(),
});

const getCurrentUserId = async (): Promise<string | null> => {
  const { data } = await supabase.auth.getSession();
  return data?.session?.user?.id ?? null;
};

const buildWeddingProfileRow = (
  weddingData: WeddingData,
  userId: string | null = null,
): Database["public"]["Tables"]["wedding_profiles"]["Insert"] => ({
  id: DEFAULT_WEDDING_ID,
  user_id: userId,
  bride_name: weddingData.brideName,
  groom_name: weddingData.groomName,
  bride_parent_names: weddingData.brideParents,
  groom_parent_names: weddingData.groomParents,
  wedding_date_time: new Date(
    `${weddingData.weddingDate}T${weddingData.weddingTime}`,
  ).toISOString(),
  theme: weddingData.theme,
  template: weddingData.template,
  background_image_url: weddingData.backgroundImage,
  primary_color: weddingData.primaryColor,
  secondary_color: weddingData.secondaryColor,
  accent_color: weddingData.accentColor,
  heading_font: weddingData.headingFont,
  body_font: weddingData.bodyFont,
  show_countdown: weddingData.showCountdown,
  social_links: weddingData.socialLinks,
  telegram_config: weddingData.telegramConfig,
  welcome_popup: {
    enabled: weddingData.welcomePopupEnabled,
    message: weddingData.welcomePopupMessage,
  },
  animations: weddingData.animations,
  event_title: weddingData.eventTitle,
  event_address: weddingData.eventAddress,
  event_map_url: weddingData.eventMapUrl,
  gift_enabled: weddingData.giftEnabled,
});

const mapProfileToWeddingData = (
  profile: Database["public"]["Tables"]["wedding_profiles"]["Row"],
  guests: Database["public"]["Tables"]["guest_invitations"]["Row"][],
  photos: Database["public"]["Tables"]["photo_gallery"]["Row"][],
  gift: Database["public"]["Tables"]["wedding_gifts"]["Row"] | null,
): WeddingData => {
  const weddingDateTime = profile.wedding_date_time
    ? new Date(profile.wedding_date_time)
    : new Date(
        `${DEFAULT_WEDDING_DATA.weddingDate}T${DEFAULT_WEDDING_DATA.weddingTime}`,
      );

  return {
    groomName: profile.groom_name ?? DEFAULT_WEDDING_DATA.groomName,
    brideName: profile.bride_name ?? DEFAULT_WEDDING_DATA.brideName,
    groomParents:
      profile.groom_parent_names ?? DEFAULT_WEDDING_DATA.groomParents,
    brideParents:
      profile.bride_parent_names ?? DEFAULT_WEDDING_DATA.brideParents,
    weddingDate: weddingDateTime.toISOString().slice(0, 10),
    weddingTime: weddingDateTime.toISOString().slice(11, 16),
    showCountdown: profile.show_countdown ?? DEFAULT_WEDDING_DATA.showCountdown,
    eventTitle: profile.event_title ?? DEFAULT_WEDDING_DATA.eventTitle,
    eventAddress: profile.event_address ?? DEFAULT_WEDDING_DATA.eventAddress,
    eventMapUrl: profile.event_map_url ?? DEFAULT_WEDDING_DATA.eventMapUrl,
    theme:
      (profile.theme as WeddingData["theme"]) ?? DEFAULT_WEDDING_DATA.theme,
    template:
      (profile.template as TemplateType) ?? DEFAULT_WEDDING_DATA.template,
    backgroundImage:
      profile.background_image_url ?? DEFAULT_WEDDING_DATA.backgroundImage,
    primaryColor: profile.primary_color ?? DEFAULT_WEDDING_DATA.primaryColor,
    secondaryColor:
      profile.secondary_color ?? DEFAULT_WEDDING_DATA.secondaryColor,
    accentColor: profile.accent_color ?? DEFAULT_WEDDING_DATA.accentColor,
    headingFont: profile.heading_font ?? DEFAULT_WEDDING_DATA.headingFont,
    bodyFont: profile.body_font ?? DEFAULT_WEDDING_DATA.bodyFont,
    photos: photos.map((photo) => photo.image_url),
    khqrImage: gift?.khqr_image_url ?? DEFAULT_WEDDING_DATA.khqrImage,
    giftEnabled: gift?.enabled ?? DEFAULT_WEDDING_DATA.giftEnabled,
    guests: guests.map(mapGuestRowToGuest),
    rsvpResponses: guests
      .filter((guest) => guest.rsvp_status !== "pending")
      .map(mapGuestRowToResponse),
    socialLinks: profile.social_links ?? DEFAULT_WEDDING_DATA.socialLinks,
    telegramConfig:
      profile.telegram_config ?? DEFAULT_WEDDING_DATA.telegramConfig,
    welcomePopupEnabled:
      profile.welcome_popup?.enabled ??
      DEFAULT_WEDDING_DATA.welcomePopupEnabled,
    welcomePopupMessage:
      profile.welcome_popup?.message ??
      DEFAULT_WEDDING_DATA.welcomePopupMessage,
    animations: profile.animations ?? DEFAULT_WEDDING_DATA.animations,
  };
};

const ensureWeddingProfile = async () => {
  const { data, error } = await supabase
    .from("wedding_profiles")
    .select("*")
    .eq("id", DEFAULT_WEDDING_ID)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Failed to load wedding profile:", error);
  }

  if (data) {
    return data;
  }

  const userId = await getCurrentUserId();
  const { data: inserted, error: insertError } = await supabase
    .from("wedding_profiles")
    .insert(buildWeddingProfileRow(DEFAULT_WEDDING_DATA, userId))
    .select()
    .single();

  if (insertError) {
    console.error("Failed to create default wedding profile:", insertError);
    return null;
  }

  return inserted;
};

const getWeddingRelationalData = async () => {
  const [guestRes, photoRes, giftRes] = await Promise.all([
    supabase
      .from("guest_invitations")
      .select("*")
      .eq("wedding_id", DEFAULT_WEDDING_ID)
      .order("created_at", { ascending: true }),
    supabase
      .from("photo_gallery")
      .select("*")
      .eq("wedding_id", DEFAULT_WEDDING_ID)
      .order("display_order", { ascending: true }),
    supabase
      .from("wedding_gifts")
      .select("*")
      .eq("wedding_id", DEFAULT_WEDDING_ID)
      .limit(1)
      .single(),
  ]);

  if (guestRes.error) {
    console.error("Failed to load guest invitations:", guestRes.error);
  }

  if (photoRes.error) {
    console.error("Failed to load photo gallery:", photoRes.error);
  }

  if (giftRes.error && giftRes.error.code !== "PGRST116") {
    console.error("Failed to load wedding gift settings:", giftRes.error);
  }

  return {
    guests: guestRes.data ?? [],
    photos: photoRes.data ?? [],
    gift: giftRes.data ?? null,
  };
};

export const getWeddingData = async (): Promise<WeddingData> => {
  const profile = await ensureWeddingProfile();
  if (!profile) {
    return DEFAULT_WEDDING_DATA;
  }

  const { guests, photos, gift } = await getWeddingRelationalData();
  return mapProfileToWeddingData(profile, guests, photos, gift);
};

export const saveWeddingData = async (
  data: Partial<WeddingData>,
): Promise<boolean> => {
  const current = await getWeddingData();
  const updated = { ...current, ...data };
  const userId = await getCurrentUserId();

  const { error: profileError } = await supabase
    .from("wedding_profiles")
    .upsert(buildWeddingProfileRow(updated, userId));
  if (profileError) {
    console.error("Failed to save wedding profile:", profileError);
    return false;
  }

  const giftRow: Database["public"]["Tables"]["wedding_gifts"]["Insert"] = {
    id: `gift-${DEFAULT_WEDDING_ID}`,
    wedding_id: DEFAULT_WEDDING_ID,
    khqr_image_url: updated.khqrImage,
    enabled: updated.giftEnabled,
  };

  const { error: giftError } = await supabase
    .from("wedding_gifts")
    .upsert(giftRow);
  if (giftError) {
    console.error("Failed to save wedding gift settings:", giftError);
    return false;
  }

  const { data: existingPhotos, error: existingPhotoError } = await supabase
    .from("photo_gallery")
    .select("id,image_url")
    .eq("wedding_id", DEFAULT_WEDDING_ID);

  if (existingPhotoError) {
    console.error(
      "Failed to load existing photos for sync:",
      existingPhotoError,
    );
    return false;
  }

  const existingPhotoUrls = (existingPhotos ?? []).map(
    (photo) => photo.image_url,
  );
  const addedPhotoUrls = updated.photos.filter(
    (url) => !existingPhotoUrls.includes(url),
  );
  const removedPhotoIds = (existingPhotos ?? [])
    .filter((photo) => !updated.photos.includes(photo.image_url))
    .map((photo) => photo.id);

  if (removedPhotoIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("photo_gallery")
      .delete()
      .in("id", removedPhotoIds);
    if (deleteError) {
      console.error("Failed to delete removed photos:", deleteError);
      return false;
    }
  }

  if (addedPhotoUrls.length > 0) {
    const photoRows = addedPhotoUrls.map((image_url, index) => ({
      id: generateGuestId(),
      wedding_id: DEFAULT_WEDDING_ID,
      image_url,
      display_order: index,
    }));

    const { error: insertError } = await supabase
      .from("photo_gallery")
      .insert(photoRows);
    if (insertError) {
      console.error("Failed to insert new photos:", insertError);
      return false;
    }
  }

  return true;
};

export const generateGuestId = (): string =>
  Math.random().toString(36).substring(2, 15);

export const addGuest = async (name: string): Promise<Guest | null> => {
  const id = generateGuestId();
  const guest = {
    id,
    wedding_id: DEFAULT_WEDDING_ID,
    guest_name: name,
    invitation_token: generateGuestId(),
    invitation_status: "sent" as const,
    rsvp_status: "pending" as const,
  };

  const { data, error } = await supabase
    .from("guest_invitations")
    .insert(guest)
    .select()
    .single();
  if (error || !data) {
    console.error("Failed to add guest:", error);
    return null;
  }

  return mapGuestRowToGuest(data);
};

export const getGuestById = async (id: string): Promise<Guest | null> => {
  const { data, error } = await supabase
    .from("guest_invitations")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Failed to fetch guest by id:", error);
    return null;
  }

  return mapGuestRowToGuest(data);
};

export const deleteGuest = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from("guest_invitations")
    .delete()
    .eq("id", id);
  if (error) {
    console.error("Failed to delete guest:", error);
    return false;
  }
  return true;
};

export const addRSVPResponse = async (
  guestId: string | undefined,
  guestName: string,
  attending: boolean,
  message: string,
): Promise<boolean> => {
  const status = attending ? "attending" : "not_attending";
  const token = generateGuestId();

  if (guestId) {
    const { error } = await supabase
      .from("guest_invitations")
      .update({
        rsvp_status: status,
        blessing_message: message,
        invitation_status: "opened",
      })
      .eq("id", guestId);

    if (error) {
      console.error("Failed to update RSVP response:", error);
      return false;
    }

    return true;
  }

  const { error } = await supabase.from("guest_invitations").insert({
    id: generateGuestId(),
    wedding_id: DEFAULT_WEDDING_ID,
    guest_name: guestName,
    invitation_token: token,
    invitation_status: "opened" as const,
    rsvp_status: status as const,
    blessing_message: message,
  });

  if (error) {
    console.error("Failed to insert RSVP response:", error);
    return false;
  }

  return true;
};

export const addPhoto = async (imageUrl: string): Promise<boolean> => {
  const { error } = await supabase.from("photo_gallery").insert({
    id: generateGuestId(),
    wedding_id: DEFAULT_WEDDING_ID,
    image_url: imageUrl,
    display_order: 0,
  });
  if (error) {
    console.error("Failed to add photo record:", error);
    return false;
  }
  return true;
};

export const deletePhotoByUrl = async (imageUrl: string): Promise<boolean> => {
  const { error } = await supabase
    .from("photo_gallery")
    .delete()
    .match({ wedding_id: DEFAULT_WEDDING_ID, image_url: imageUrl });

  if (error) {
    console.error("Failed to delete photo record:", error);
    return false;
  }

  return true;
};

export const sendRSVPToTelegram = async (
  guestName: string,
  attending: boolean,
  message: string,
): Promise<boolean> => {
  const { data: profile, error: profileError } = await supabase
    .from("wedding_profiles")
    .select("telegram_config")
    .eq("id", DEFAULT_WEDDING_ID)
    .single();

  if (profileError || !profile) {
    console.error("Failed to retrieve Telegram config:", profileError);
    return false;
  }

  const telegramConfig = profile.telegram_config as TelegramConfig;

  if (
    !telegramConfig?.enabled ||
    !telegramConfig?.botToken ||
    !telegramConfig?.chatId
  ) {
    return false;
  }

  const text =
    `🎊 *New RSVP Response*\n\n` +
    `👤 *Guest:* ${guestName}\n` +
    `✅ *Status:* ${attending ? "Attending" : "Not Attending"}\n` +
    `💌 *Message:* ${message || "No message"}\n` +
    `📅 *Date:* ${new Date().toLocaleString()}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${telegramConfig.botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: telegramConfig.chatId,
          text,
          parse_mode: "Markdown",
        }),
      },
    );
    return response.ok;
  } catch (error) {
    console.error("Failed to send Telegram message:", error);
    return false;
  }
};
