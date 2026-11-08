'use client';

import { useState } from 'react';
import { type DateRange } from 'react-day-picker';
import { Calendar } from '@/components/base-ui/calendar';

export interface Calendar3Props {
  value?: DateRange | undefined;
  onChange?: (range: DateRange | undefined) => void;
  className?: string;
  caption?: string;
}

const Calendar3 = ({
  value,
  onChange,
  className,
  caption = "Single month calendar with range selection",
}: Calendar3Props = {}) => {
  const [internalDateRange, setInternalDateRange] = useState<DateRange | undefined>({
    from: new Date(2025, 5, 4),
    to: new Date(2025, 5, 17),
  });

  const dateRange = value !== undefined ? value : internalDateRange;
  const setDateRange = (range: DateRange | undefined) => {
    setInternalDateRange(range);
    onChange?.(range);
  };

  return (
    <div className={className}>
      <Calendar
        mode="range"
        selected={dateRange}
        defaultMonth={dateRange?.from}
        onSelect={setDateRange}
        classNames={{
          today: "!bg-transparent",
          day_button: "!ring-0 !ring-offset-0 focus:!ring-0 focus-visible:!ring-0",
        }}
        className="!border-0 !bg-transparent transition-colors transition-transform !ring-0 !ring-offset-0 focus:!ring-0 focus:!ring-offset-0 focus-visible:!ring-0 focus-visible:!ring-offset-0 [&_*]:!ring-0 [&_*]:!ring-offset-0 [&_*]:focus:!ring-0 [&_*]:focus-visible:!ring-0 [&_.rdp-day_today]:!bg-transparent"
      />
      {caption && (
        <p className="text-muted-foreground mt-3 text-center text-xs font-mono" role="region">
          {caption}
        </p>
      )}
    </div>
  );
};

export { Calendar3 };
export default Calendar3;
