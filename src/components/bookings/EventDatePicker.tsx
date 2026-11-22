"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

type EventDatePickerProps = {
  id: string;
  name: string;
  value?: Date;
  onChange: (date?: Date) => void;
  fromDate: Date;
  toDate: Date;
  invalid?: boolean;
  describedBy?: string;
};

// A calendar picker that looks the same in every browser. It shows dates the way the rest of the site does
// and sends YYYY-MM-DD, the format the server expects.
const EventDatePicker = ({ id, name, value, onChange, fromDate, toDate, invalid, describedBy }: EventDatePickerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <input type="hidden" name={name} value={value ? format(value, "yyyy-MM-dd") : ""} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <button
              type="button"
              id={id}
              data-invalid={invalid || undefined}
              aria-describedby={describedBy}
              className={cn(
                "flex h-11 w-full items-center justify-between gap-(--space-sm) rounded-(--radius-input) border border-input bg-card px-3.5 text-left text-md transition-[border-color] duration-(--dur-short) outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus data-invalid:border-destructive",
                value ? "text-ink" : "text-ink-3"
              )}
            />
          }
        >
          {value ? format(value, "EEE, d MMM yyyy") : "Choose a date"}
          <CalendarDays className="size-5 shrink-0 text-ink-3" aria-hidden="true" />
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-2">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setOpen(false);
            }}
            defaultMonth={value ?? fromDate}
            startMonth={fromDate}
            endMonth={toDate}
            disabled={[{ before: fromDate }, { after: toDate }]}
            captionLayout="dropdown"
            weekStartsOn={6}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default EventDatePicker;
