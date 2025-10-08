import { create } from "zustand";
import { createStore } from "zustand/vanilla";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface CounterState {
  ready: boolean;
  count: number;
  increment: () => void;
  reset: () => void;
  data: {
    name: {
      first: string;
      last: string;
    };
  };
}
// Start of Selection
// const useCounterStore = create<CounterState>()(
//   persist(
//     immer((set) => ({
//       ready: false,
//       count: 0,
//       data: {
//         name: { first: "Sydexa", last: "React advanced" },
//       },
//       increment: () =>
//         set((state) => ({
//           count: state.count + 1,
//         })),
//       reset: () => set((state) => ({ ...state, count: 0 })),
//     })),
//     {
//       name: "counter", // storage key (required)
//       partialize: (state) => ({
//         count: state.count,
//       }), // only persist count
//       onRehydrateStorage: () => {
//         // Mark as ready after rehydration
//         useCounterStore.setState({ ready: true });
//       },
//     }
//   )
// );

const useCounterStore = create<CounterState>()(
  persist(
    immer((set) => ({
      ready: false,
      count: 0,
      data: {
        name: { first: "Sydexa", last: "React advanced" },
      },
      increment: () =>
        set((state) => ({
          count: state.count + 1,
        })),
      reset: () => set((state) => ({ ...state, count: 0 })),
    })),
    {
      name: "counter", // storage key (required)
      partialize: (state) => ({
        count: state.count,
      }), // only persist count
      onRehydrateStorage: () => {
        // Mark as ready after rehydration
        useCounterStore.setState({ ready: true });
      },
    }
  )
);

// const store = createStore((set, get) => ({
//   count: 100,
//   inc: () => set({ count: (get() as { count: number }).count + 1 }),
// }));

// // Subscribe manually
// store.subscribe(console.log);
// (store.getState() as { inc: () => void }).inc();
export default useCounterStore;