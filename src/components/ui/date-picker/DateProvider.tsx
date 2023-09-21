import type { Accessor, JSXElement, Setter } from "solid-js";
import {
  getWeeksInMonth,
  startOfMonth,
  startOfWeek,
  subMonths,
  addMonths,
  addDays,
} from "date-fns";
import { createContext, splitProps, useContext } from "solid-js";

type DateContextObj = {
  date: Accessor<Date>;
  setDate: Setter<Date>;
  month: Accessor<Date>;
  setMonth: Setter<Date>;
  nextMonth: () => void;
  prevMonth: () => void;
  getDaysOfMonth: () => Date[][];
};

type DateContextProps = {
  date: Accessor<Date>;
  setDate: Setter<Date>;
  children: JSXElement;
  month: Accessor<Date>;
  setMonth: Setter<Date>;
};

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const DateContext = createContext<DateContextObj>();

export function DateProvider(props: DateContextProps) {
  const [{ date, setDate, month, setMonth }] = splitProps(props, [
    "date",
    "setDate",
    "month",
    "setMonth",
  ]);

  function nextMonth() {
    setMonth(addMonths(month(), 1));
  }

  function prevMonth() {
    setMonth(subMonths(month(), 1));
  }

  function getDaysOfMonth() {
    const daysOfMonth: Date[][] = [];
    const WEEK_DAYS = 7;
    const currentDate = month();

    const totalWeeks = getWeeksInMonth(currentDate, { weekStartsOn: 1 });
    const monthStart = startOfMonth(currentDate);
    const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });

    let currentDay = firstWeekStart;

    for (let week = 1; week <= totalWeeks; week++) {
      const weekDays: Date[] = [];
      for (let i = 0; i < WEEK_DAYS; i++) {
        weekDays.push(currentDay);
        currentDay = addDays(currentDay, 1);
      }
      daysOfMonth.push(weekDays);
    }
    return daysOfMonth;
  }

  return (
    <DateContext.Provider
      value={{ date, setDate, nextMonth, prevMonth, getDaysOfMonth, month, setMonth }}
    >
      {props.children}
    </DateContext.Provider>
  );
}

export function useDateContext() {
  const ctx = useContext(DateContext);
  if (!ctx) throw new Error("Function must be called within DateContextProvider");
  return ctx;
}
