import { cn } from "@/lib/utils";

interface OrnamentDividerProps {
  className?: string;
  children?: React.ReactNode;
}

export const OrnamentDivider = ({ className, children }: OrnamentDividerProps) => {
  return (
    <div className={cn("ornament-divider my-8", className)}>
      {children || (
        <svg
          width="40"
          height="20"
          viewBox="0 0 40 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-gold"
        >
          <path
            d="M20 0C20 0 25 10 40 10C25 10 20 20 20 20C20 20 15 10 0 10C15 10 20 0 20 0Z"
            fill="currentColor"
            opacity="0.8"
          />
        </svg>
      )}
    </div>
  );
};
