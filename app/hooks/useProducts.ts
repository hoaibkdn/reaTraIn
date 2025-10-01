import { useQuery, useQueryClient, QueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts } from "~/api/product";
import { fetchUsers } from "~/api/user";


export const useProducts = (pageSize: number = 20) => {
  return useInfiniteQuery({
    queryKey: ["products"],
    queryFn: ({ pageParam = 0 }) => fetchProducts(pageSize, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const totalLoaded = allPages.length * pageSize;
      const totalAvailable = lastPage.total || 0;
      if (totalLoaded >= totalAvailable) {
        return undefined;
      }
      if (lastPage.products.length < pageSize) {
        return undefined;
      }
      return allPages.length * pageSize;
    },
    initialPageParam: 0,
  });
};

export const prefetchProducts = (
  queryClient: QueryClient,
  countLimit: number
) => {
  return queryClient.prefetchQuery({
    queryKey: ["products", countLimit],
    queryFn: () => fetchProducts(countLimit),
    staleTime: 5 * 60 * 1000,
  });
};

export const prefetchList = async (
  queryClient: QueryClient,
  countLimit: number
) => {
  return Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["products", countLimit],
      queryFn: () => fetchProducts(countLimit),
      staleTime: 5 * 60 * 1000,
    }),
    queryClient.prefetchQuery({
      queryKey: ["users"], 
      queryFn: () => fetchUsers({ signal: new AbortSignal() }),
      staleTime: 5 * 60 * 1000,
    }),
  ]);
};
