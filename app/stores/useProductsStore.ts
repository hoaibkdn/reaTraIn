import { create } from "zustand";
import { shallow } from "zustand/shallow";
import { persist, devtools } from "zustand/middleware";

interface ProductsState {
  products: any[];
  ids: any[];
  productsData: any;
  setIds: (ids: any[]) => void;
  setProductsData: (productsData: any) => void;
  setProducts: (products: any[]) => void;
}

const useProductsStore = create<ProductsState>()(
  devtools(
    persist(
      (set) => ({
        products: [],
        ids: [],
        productsData: {},
        setProducts: (products: any[]) => set({ products }),
        setIds: (ids: any[]) => set({ ids }),
        setProductsData: (productsData: any) => set({ productsData }),
      }),
      {
        name: "products",
        partialize: (state) => ({
          products: state.products,
        }),
      }
    )
  )
);

export default useProductsStore;
export { shallow };
