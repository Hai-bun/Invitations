import { Language } from "./i18n";

const KHMER_WEEKDAYS = [
  "អាទិត្យ",
  "ច័ន្ទ",
  "អង្គារ",
  "ពុធ",
  "ព្រហស្បតិ៍",
  "សុក្រ",
  "សៅរ៍",
];

const KHMER_MONTHS = [
  "មករា",
  "កុម្ភៈ",
  "មីនា",
  "មេសា",
  "ឧសភា",
  "មិថុនា",
  "កក្កដា",
  "សីហា",
  "កញ្ញា",
  "តុលា",
  "វិច្ឆិកា",
  "ធ្នូ",
];

/** Long-form wedding date, localised to the guest's chosen language. */
export const formatWeddingDate = (
  dateStr: string,
  language: Language,
): string => {
  const date = new Date(dateStr);

  if (language === "km") {
    try {
      return new Intl.DateTimeFormat("km-KH", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date);
    } catch {
      // Fallback: manual Khmer month/weekday names
      return `${KHMER_WEEKDAYS[date.getDay()]} ${date.getDate()} ${
        KHMER_MONTHS[date.getMonth()]
      } ${date.getFullYear()}`;
    }
  }

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/** Turns a stored "HH:mm" value into a 12-hour display time. */
export const formatWeddingTime = (timeStr: string): string => {
  const [hours, minutes] = timeStr.split(":");
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};
