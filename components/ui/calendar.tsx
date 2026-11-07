"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const defaultClassNames = getDefaultClassNames();

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-2 sm:p-3 font-sans select-none", className)}
      classNames={{
        root: cn(defaultClassNames.root, "w-fit"),
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-3",
        month_caption: "flex justify-center pt-1 relative items-center mb-2",
        caption_label: "text-xs font-mono font-semibold uppercase tracking-wider text-foreground",
        nav: "space-x-1 flex items-center",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "absolute left-1 size-7 bg-transparent p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-1 size-7 bg-transparent p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "text-muted-foreground rounded-md w-8 font-mono text-[11px] text-center",
        weeks: "flex flex-col gap-1 mt-1",
        week: "flex w-full",
        day: cn(
          "relative p-0 text-center text-xs focus-within:relative focus-within:z-20",
          props.mode === "range"
            ? "[&:has(>.rdp-range_end)]:rounded-r-md [&:has(>.rdp-range_start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-mono text-xs font-normal aria-selected:opacity-100 hover:bg-muted cursor-pointer transition-colors"
        ),
        range_start: "rdp-range_start !bg-[#8B1E27] !text-white rounded-l-md font-semibold hover:!bg-[#8B1E27]",
        range_end: "rdp-range_end !bg-[#8B1E27] !text-white rounded-r-md font-semibold hover:!bg-[#8B1E27]",
        selected: "!bg-[#8B1E27] !text-white hover:!bg-[#8B1E27] hover:!text-white focus:!bg-[#8B1E27] focus:!text-white dark:!bg-[#D4847A] dark:!text-slate-950 font-semibold",
        today: "font-bold text-[#8B1E27] dark:text-[#D4847A] underline underline-offset-2",
        outside: "text-muted-foreground/40 opacity-50 aria-selected:bg-[#8B1E27]/10 aria-selected:text-muted-foreground",
        disabled: "text-muted-foreground/30 opacity-40 cursor-not-allowed",
        range_middle: "rdp-range_middle !bg-[#8B1E27]/15 !text-[#8B1E27] dark:!bg-[#D4847A]/25 dark:!text-[#D4847A] rounded-none font-medium",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: chevronClass }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("size-4", chevronClass)} />
          ) : (
            <ChevronRight className={cn("size-4", chevronClass)} />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
