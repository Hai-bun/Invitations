import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// A small month view of the wedding month with the wedding day highlighted.
// Takes a plain "YYYY-MM-DD" string and does no timezone math.
export const MonthCalendar = ({ dateStr }: { dateStr: string }) => {
  const parts = (dateStr || "").split("-").map(Number);
  if (parts.length < 3 || parts.some((n) => Number.isNaN(n))) return null;
  const [year, month, day] = parts; // month is 1-12

  const firstWeekday = new Date(year, month - 1, 1).getDay(); // 0=Sun
  const lead = (firstWeekday + 6) % 7; // Monday-first offset
  const daysInMonth = new Date(year, month, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < lead; i += 1) cells.push(null);
  for (let d = 1; d <= daysInMonth; d += 1) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="month-calendar">
      <p className="month-calendar-title">
        {MONTHS[month - 1]} {year}
      </p>
      <div className="month-calendar-grid">
        {WEEKDAYS.map((w) => (
          <span key={w} className="month-calendar-wd">
            {w}
          </span>
        ))}
        {cells.map((c, i) => (
          <span
            key={i}
            className={cn(
              "month-calendar-day",
              c === day && "is-wedding",
            )}>
            {c === day ? (
              <Heart className="w-4 h-4" fill="currentColor" />
            ) : (
              c ?? ""
            )}
          </span>
        ))}
      </div>
    </div>
  );
};
