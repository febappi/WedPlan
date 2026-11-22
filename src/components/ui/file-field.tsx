"use client";

import { useId, useState } from "react";
import { ImageUp } from "lucide-react";
import { cn } from "@/lib/utils";

type FileFieldProps = Omit<React.ComponentProps<"input">, "type"> & {
  buttonLabel?: string;
  emptyText?: string;
};

// A file picker that fits narrow screens: the native control is hidden, its label is the button
// and the chosen file name sits beside it, shortened when there is no room
const FileField = ({ id, className, onChange, buttonLabel = "Choose photo", emptyText = "No photo chosen", ...props }: FileFieldProps) => {
  const autoId = useId();
  const inputId = id || autoId;
  const [fileName, setFileName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e);
    // read after the form's handler, which clears the input when the file is rejected
    setFileName(e.target.files?.[0]?.name || "");
  };

  return (
    <div className={cn("flex min-w-0 flex-wrap items-center gap-x-(--space-sm) gap-y-(--space-2xs)", className)}>
      <input id={inputId} type="file" className="peer sr-only" onChange={handleChange} {...props} />
      <label
        htmlFor={inputId}
        className="inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-(--space-xs) rounded-(--radius-pill) border border-rule bg-paper-3 px-(--space-md) text-sm font-semibold text-ink transition-colors duration-(--dur-short) peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus peer-aria-invalid:border-destructive hover:border-ink-3"
      >
        <ImageUp className="size-4" aria-hidden="true" />
        {buttonLabel}
      </label>
      <span className="min-w-[7rem] flex-1 truncate text-sm text-ink-3">{fileName || emptyText}</span>
    </div>
  );
};

export { FileField };
