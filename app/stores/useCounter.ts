import { create } from "zustand";
import { createStore } from "zustand/vanilla";

const useCounterStore = create((set) => ({
  count: 0,
  increment: () =>
    set((state: { count: number }) => ({ count: state.count + 1 })),
  reset: () => set({ count: 0 }),
}));

const store = createStore((set, get) => ({
  count: 100,
  inc: () => set({ count: (get() as { count: number }).count + 1 }),
}));

// Subscribe manually
store.subscribe(console.log);
(store.getState() as { inc: () => void }).inc();
export default useCounterStore;
