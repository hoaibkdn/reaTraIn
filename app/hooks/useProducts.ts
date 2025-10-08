import {
  useQuery,
  useQueryClient,
  QueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { fetchProducts } from "~/api/product";
import { fetchUsers } from "~/api/user";
import useProductsStore from "~/stores/useProductsStore";

export const useProducts = (pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: ["products", pageSize],
    queryFn: ({ pageParam }) => {
      console.log('🔄 fetchProducts called with pageParam:', pageParam);
      return fetchProducts(pageParam, pageSize);
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = (allPages?.length || 0) * pageSize;
      const totalAvailable = lastPage.total || 0;
      if (totalLoaded >= totalAvailable) {
        return undefined;
      }
      if (lastPage.products?.length < pageSize) {
        return undefined;
      }
      return totalLoaded + pageSize;
    },
    initialPageParam: 0,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

export const prefetchProducts = (
  queryClient: QueryClient,
  countLimit: number
) => {
  return queryClient.prefetchQuery({
    queryKey: ["products", countLimit],
    queryFn: () => fetchProducts(0, countLimit),
    staleTime: 1000,
  });
};

export const prefetchList = async (
  queryClient: QueryClient,
  countLimit: number
) => {
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["products", countLimit],
      queryFn: () => fetchProducts(0, countLimit),
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["users"],
      queryFn: () => fetchUsers({ signal: new AbortSignal() }),
      staleTime: 5 * 60 * 1000,
    }),
  ]);
};

// Helper function to compare arrays shallowly by ID
const arraysEqual = (a: any[], b: any[]) => {
  if (a.length !== b.length) return false;
  return a.every((val, index) => val?.id === b[index]?.id);
};

export const subscribeProducts = (queryClient: QueryClient) => {
  const cache = queryClient.getQueryCache()
  const unsubscribe = cache.subscribe((event) => {
    console.log('📦 Event:', event?.query?.queryKey, 'Type:', event?.type);
    
    // Only update store on successful data updates, not on loading states
    if (event?.query?.queryKey?.[0] === "products" && 
        event?.type === 'updated' && 
        event?.query?.state?.status === 'success') {
      
      const data = event.query.state.data as any;
      console.log('📦 Query data:', data);
      
      if (data && typeof data === 'object' && data.pages) {
        const newProducts = data.pages.flatMap((page: any) => page.products);
        const currentProducts = useProductsStore.getState().products;
        
        console.log('📦 Comparing products - New:', newProducts.length, 'Current:', currentProducts.length);
        
        if (!arraysEqual(newProducts, currentProducts)) {
          console.log('📦 Updating store with new products');
          useProductsStore.getState().setProducts(newProducts);
        } else {
          console.log('📦 Products are the same, skipping store update');
        }
      }
    }
  });
  return unsubscribe;
};
