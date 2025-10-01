import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { addUser, fetchUserDetails, fetchUsers } from "../api/user";

export const usersKeys = {
  all: ["users"],
  details: (id: string) => [...usersKeys.all, id],
};

// export const useUsers = () => {
//   return useQuery({
//     queryKey: usersKeys.all,
//     queryFn: ({ signal }) => fetchUsers({ signal }),
//     staleTime: 5 * 60,
//     // refetchInterval: 30000, // poll every 30s
//     // refetchIntervalInBackground: true, // keep polling even if tab inactive
//   });
// };

export const useUsers = () => {
  return useSuspenseQuery({
    queryKey: usersKeys.all,
    queryFn: fetchUsers,
    // retry: false,
  });
};

export const useUserDetail = (id: string) => {
  return useQuery({
    queryKey: usersKeys.details(id),
    queryFn: () => fetchUserDetails(id),
  });
};

export const useMultipleUsers = (ids: string[]) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: usersKeys.details(id),
      queryFn: () => fetchUserDetails(id),
    })),
  });
};

// export const useMultipleUsers = () => {
//   return useQueries({
//     queries: [
//       {
//         queryKey: ["user", 1],
//         queryFn: () => fetchUserDetails("1"),
//       },
//       {
//         queryKey: ["user", 2],
//         queryFn: () => fetchUserDetails("2"),
//       },
//     ],
//   });
// };

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addUser,
    // onMutate: async (newUser) => {
    //   // await queryClient.cancelQueries({ queryKey: usersKeys.all });
    //   const prevUsers = queryClient.getQueryData(usersKeys.all);
    //   queryClient.setQueryData(usersKeys.all as any, (old: any) => [
    //     ...old,
    //     newUser,
    //   ]);

    //   return { prevUsers };
    // },
    onError: (err, newUser, context) => {},
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: usersKeys.all });
    },
  });
};

