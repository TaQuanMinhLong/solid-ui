import { Button } from "./components/ui";
import { createDialog } from "./components/ui/dialog";

export default function App() {
  const [Dialog, { open, close }] = createDialog();

  return (
    <main class="bg-white flex items-center justify-center min-h-screen text-slate-800">
      <div class="flex flex-col gap-3">
        <Button onClick={open}>Open Dialog</Button>
        <Dialog.Root>
          Some content
          <Dialog.Content></Dialog.Content>
        </Dialog.Root>
      </div>
    </main>
  );
}
