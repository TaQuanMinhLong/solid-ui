import type { Accessor, Setter } from "solid-js";
import { DateProvider, WEEKDAYS, useDateContext } from "./DateProvider";
import { IconChevron } from "~/components/icons";
import { createUncontrolledSignal } from "~/hooks";
import { For } from "solid-js";
import { Button } from "~/components/ui/button";
import { format, isSameDay, isSameMonth, isWeekend } from "date-fns";
import { cn } from "~/lib/styles";

interface CalendarProps {
  date?: Accessor<Date>;
  setDate?: Setter<Date>;
  defaultDate?: Date;
}

function Calendar(props: CalendarProps) {
  const [date, setDate] = createUncontrolledSignal({
    defaultValue: props.defaultDate,
    finalValue: new Date(),
    getter: props.date,
    setter: props.setDate,
  });

  return (
    <DateProvider date={date} setDate={setDate}>
      <div class="border border-input rounded-md p-3">
        <CalendarHeader />
        <CalendarMonth />
      </div>
    </DateProvider>
  );
}

function CalendarHeader() {
  const { date, nextMonth, prevMonth } = useDateContext();
  return (
    <div class="flex justify-center pt-1 relative items-center">
      <div class="text-sm font-medium" aria-live="polite" role="presentation">
        {format(date(), "MMMM yyyy")}
      </div>
      <div class="space-x-1 flex items-center">
        <Button
          class="w-7 h-7 inline-flex items-center duration-200 justify-center absolute left-1"
          aria-label="Go to previous month"
          name="previous-month"
          onClick={prevMonth}
          variant="outline"
          size="icon"
        >
          <IconChevron class="w-2.5 h-2.5" />
        </Button>
        <Button
          class="w-7 h-7 inline-flex items-center duration-200 justify-center absolute right-1"
          aria-label="Go to previous month"
          name="previous-month"
          onClick={nextMonth}
          variant="outline"
          size="icon"
        >
          <IconChevron class="w-2.5 h-2.5 rotate-180" />
        </Button>
      </div>
    </div>
  );
}

function MonthHeader() {
  return (
    <thead>
      <tr class="flex">
        <For each={WEEKDAYS}>
          {(day) => (
            <th
              scope="col"
              aria-label={day}
              class="text-muted-foreground rounded-md flex-grow font-normal text-[0.8rem]"
            >
              {day.slice(0, 2)}
            </th>
          )}
        </For>
      </tr>
    </thead>
  );
}

function CalendarMonth() {
  const { getDaysOfMonth } = useDateContext();
  return (
    <table role="grid" class="w-full border-collapse space-y-1 mt-4">
      <MonthHeader />
      <tbody class="mt-1" role="rowgroup">
        <For each={getDaysOfMonth()}>
          {(week) => (
            <tr class="flex w-full mt-2">
              <For each={week}>{(day) => <Day day={day} />}</For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}

type DayProps = {
  day: Date;
};

function Day(props: DayProps) {
  const { date, setDate } = useDateContext();

  const isSelected = () => isSameDay(props.day, date());
  const isToday = () => isSameDay(props.day, new Date());
  const isOutside = () => !isSameMonth(props.day, date());

  return (
    <td
      class="text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 flex-grow"
      role="presentation"
    >
      <Button
        onClick={() => setDate(props.day)}
        aria-selected={isSelected() || undefined}
        variant="ghost"
        class={cn(
          "h-9 w-9 p-0 font-normal",
          { "text-red-500 hover:text-red-400": isWeekend(props.day) },
          { "bg-accent text-accent-foreground": isToday() },
          {
            "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground":
              isSelected(),
          },
          { "text-muted-foreground opacity-50": isOutside() }
        )}
        role="gridcell"
        tabIndex={-1}
        name="day"
      >
        {props.day.getDate()}
      </Button>
    </td>
  );
}

export { Calendar };
