import { Check, Circle } from "lucide-react";
import { passwordRules } from "@/lib/validation";
import { cn } from "@/lib/utils";

// Ticks off each password rule as the user types
const PasswordChecklist = ({ id, password, showErrors }: { id: string; password: string; showErrors: boolean }) => {
  return (
    <ul id={id} aria-live="polite" className="space-y-(--space-3xs) text-sm">
      {passwordRules.map((rule) => {
        const met = rule.test(password);
        return (
          <li
            key={rule.id}
            className={cn(
              "flex items-center gap-(--space-xs) transition-colors duration-(--dur-short)",
              met ? "text-mint-deep" : showErrors ? "text-destructive" : "text-ink-3"
            )}
          >
            {met ? <Check className="size-4 shrink-0" aria-hidden="true" /> : <Circle className="size-3.5 shrink-0" aria-hidden="true" />}
            <span>
              {rule.label}
              <span className="sr-only">{met ? " (done)" : " (not yet)"}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
};

export default PasswordChecklist;
