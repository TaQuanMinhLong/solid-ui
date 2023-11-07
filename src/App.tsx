import { For, createEffect, createSignal, onCleanup } from "solid-js";
import { Button, buttonVariants } from "./components/ui/button";
import { Select } from "./components/ui/select";

export default function App() {
  const groceries = ["🍎 Apples", "🍌 Bananas", "🥦 Broccoli", "🥕 Carrots", "🍫 Chocolate"];

  return (
    <main class="bg-white p-6 min-h-screen text-slate-800">
      <Select options={groceries} />
    </main>
  );
}
