import { Popover, createPopover } from "./components/ui/popover";

export default function App() {
  const popover = createPopover();

  return (
    <main class="bg-white p-6 min-h-screen text-slate-800">
      <Popover.Root $popover={popover}>
        <Popover.Trigger>Toggle</Popover.Trigger>
        <Popover.Content class="bg-red-200 p-2">Some Content</Popover.Content>
      </Popover.Root>
    </main>
  );
}
