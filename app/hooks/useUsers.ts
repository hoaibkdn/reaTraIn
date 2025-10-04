import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchUsers, fetchUserDetails, addUser } from "../api/user";

const usersKeys = {
  all: ["users"] as const,
  detail: (id: string) => [...usersKeys.all, id] as const,
};

const useUsers = () => {
  return useQuery({
    queryKey: usersKeys.all,
    queryFn: fetchUsers,
    staleTime: 1000,
    retry: 3,
  });
};

export const useMultipleUsers = (ids: string[]) => {
  // [1, 3, 5, 7, 8]
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: usersKeys.detail(id),
      queryFn: () => fetchUserDetails(id),
    })),
  });
};

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUser,
    onMutate: async (newUser) => {
      console.log("newUser ", newUser);
      await queryClient.cancelQueries({ queryKey: usersKeys.all });
      const prevUsers = queryClient.getQueryData(usersKeys.all); // get from cache
      queryClient.setQueryData(usersKeys.all as any, (old: any) => {
        console.log("old ", old);
        return {
            ...old,
            users: [newUser, ...old.users],
        }
        // console.log("newUser ", newUser);
        // return [newUser, ...old];
      });

      console.log("prevUsers ", prevUsers);
      return { prevUsers };
    },
    onError: (err, newUser, context) => {
        console.log("err ", err);
    },
    onSettled: () => {
    //    queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
};

export { useUsers };
