import { useEffect, useState } from "react";
import { Check, Heart, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getTranslations, type Language } from "@/lib/i18n";

interface Wish {
  id: string;
  guest_name: string;
  rsvp_status: string;
  blessing_message: string | null;
}

// Guest wall: every answered RSVP (name, attending or not, blessing), newest
// first. Shown to a guest right after they submit their own response.
export const GuestWishes = ({ language }: { language: Language }) => {
  const t = getTranslations(language);
  const [wishes, setWishes] = useState<Wish[]>([]);

  useEffect(() => {
    let live = true;
    (async () => {
      const { data } = await supabase
        .from("guest_invitations")
        .select("id, guest_name, rsvp_status, blessing_message, updated_at")
        .neq("rsvp_status", "pending")
        .order("updated_at", { ascending: false })
        .limit(100);
      if (live && data) setWishes(data as Wish[]);
    })();
    return () => {
      live = false;
    };
  }, []);

  if (!wishes.length) return null;

  return (
    <div className="max-w-md mx-auto mt-10 text-left">
      <h3 className="font-serif text-2xl font-semibold text-foreground text-center mb-4 flex items-center justify-center gap-2">
        <Heart className="w-5 h-5 text-primary" fill="currentColor" />
        {t.wishesTitle}
      </h3>
      <ul className="space-y-3 max-h-[28rem] overflow-y-auto pr-1">
        {wishes.map((w) => {
          const yes = w.rsvp_status === "attending";
          return (
            <li key={w.id} className="bg-background rounded-lg p-4 shadow-card">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-foreground break-words">{w.guest_name}</span>
                <span
                  className={
                    "inline-flex items-center gap-1 text-xs shrink-0 " +
                    (yes ? "text-primary" : "text-muted-foreground")
                  }>
                  {yes ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  {yes ? t.wishesAttending : t.wishesNotAttending}
                </span>
              </div>
              {w.blessing_message?.trim() && (
                <p className="text-sm text-muted-foreground mt-2 whitespace-pre-line break-words">
                  {w.blessing_message}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
