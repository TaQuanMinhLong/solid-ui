import type { Accessor, Setter } from "solid-js";
import { Popover, createPopover } from "~/components/ui/popover";
import { createUncontrolledSignal } from "~/hooks";
import { Calendar } from ".";
import { format } from "date-fns";
import { Label } from "~/components/ui/label";

type DatePickerProps = {
  date?: Accessor<Date>;
  setDate?: Setter<Date>;
  defaultDate?: Date;
};

export function DatePicker(props: DatePickerProps) {
  const popover = createPopover({ triggerId: "date-input" });
  const [date, setDate] = createUncontrolledSignal({
    defaultValue: props.defaultDate,
    finalValue: new Date(),
    getter: props.date,
    setter: props.setDate,
  });

  return (
    <Popover.Root class="flex flex-col gap-2 w-[200px]" ctx={popover}>
      <Label for="date-input">Date Input</Label>
      <Popover.Trigger class="border-input px-4 py-2 border text-sm text-foreground text-left rounded-md">
        {format(date(), "dd/MM/yyyy")}
      </Popover.Trigger>
      <Popover.Content>
        <Calendar date={date} setDate={setDate} />
      </Popover.Content>
    </Popover.Root>
  );
}
