import { Button } from "~/components/ui/button";
import {
  DialogDescription,
  createDialog,
  DialogFooter,
  DialogTitle,
  Dialog,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export function DialogExample() {
  const [ref, { open, close }] = createDialog();
  return (
    <div>
      <Button onClick={open}>Edit Profie</Button>
      <Dialog ref={ref}>
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </div>
        <div class="grid gap-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="username" class="text-right">
              Username
            </Label>
            <Input id="username" value="@peduarte" class="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={close}>Save changes</Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
