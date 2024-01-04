import { Match, Switch, createSignal } from "solid-js";
import { SelectInput } from "./components/ui/select";
import { DialogExample } from "./examples";

export default function App() {
  const examples = ["Dialog"];
  const [example, setExample] = createSignal<string>("");

  return (
    <main class="bg-white p-6 min-h-dvh flex items-center flex-col gap-6 text-slate-800">
      <h1 class="text-center font-bold text-3xl">Solid-UI Examples</h1>
      <SelectInput
        label="Select Example"
        options={examples}
        value={example}
        onChange={setExample}
      />

      <Switch>
        <Match when={example() === "Dialog"}>
          <DialogExample />
        </Match>
      </Switch>
    </main>
  );
}
