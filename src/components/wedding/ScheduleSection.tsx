import { Clock } from "lucide-react";
import type { ScheduleConfig } from "@/lib/weddingStore";
import { getTranslations, type Language, getStoredLanguage } from "@/lib/i18n";
import { formatWeddingTime } from "@/lib/weddingFormat";

interface ScheduleSectionProps {
  schedule: ScheduleConfig;
  language?: Language;
}

// Renders "HH:mm" as a 12-hour time, but leaves any other free-text as-is.
const displayTime = (time: string): string =>
  /^\d{1,2}:\d{2}$/.test(time.trim()) ? formatWeddingTime(time.trim()) : time;

export const ScheduleSection = ({ schedule, language }: ScheduleSectionProps) => {
  const lang = language || getStoredLanguage();
  const t = getTranslations(lang);

  const items = (schedule?.items ?? []).filter(
    (item) => item.title?.trim() || item.time?.trim(),
  );

  if (!schedule?.enabled || items.length === 0) return null;

  return (
    <section className="scroll-reveal py-16 px-4 bg-romantic-gradient">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <Clock className="w-10 h-10 text-primary mx-auto mb-4" />
          <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
            {schedule.title?.trim() || t.weddingSchedule}
          </h2>
        </div>

        <div className="relative">
          {/* Vertical timeline spine */}
          <div className="absolute left-[calc(0.5rem-1px)] sm:left-1/2 top-2 bottom-2 w-px bg-primary/30 sm:-translate-x-1/2" />

          <ul className="space-y-8">
            {items.map((item, index) => (
              <li
                key={item.id || index}
                className="relative pl-8 sm:pl-0 sm:grid sm:grid-cols-2 sm:gap-8 sm:items-center">
                {/* Node dot */}
                <span className="absolute left-0 top-1.5 sm:left-1/2 sm:-translate-x-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-background" />

                {/* Time — left column on desktop, alternating side */}
                <div
                  className={
                    index % 2 === 0
                      ? "sm:text-right sm:pr-8"
                      : "sm:order-2 sm:text-left sm:pl-8"
                  }>
                  <p className="font-serif text-xl text-primary font-semibold">
                    {displayTime(item.time)}
                  </p>
                </div>

                {/* Detail card */}
                <div
                  className={
                    index % 2 === 0
                      ? "sm:order-2 sm:text-left sm:pl-8"
                      : "sm:text-right sm:pr-8"
                  }>
                  <h3 className="font-serif text-lg font-semibold text-foreground">
                    {item.title}
                  </h3>
                  {item.description?.trim() && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
