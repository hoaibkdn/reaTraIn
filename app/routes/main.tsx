import {
  useQuery,
  useQueryClient,
  useQueryErrorResetBoundary,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { addUser, fetchUsers } from "../api/user";
import { data, Link } from "react-router";
import {
  useUsers,
  useAddUser,
  useMultipleUsers,
  usersKeys,
} from "../hooks/useUsers";
import { prefetchProducts } from "../hooks/useProducts";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const Main = () => {
  const queryClient = useQueryClient();

  // queryClient.cancelQueries();
  const { mutate: addUserMutation } = useAddUser();
  const queryErrorResetBoundary = useQueryErrorResetBoundary();
  // useQuery
  // const { data, error, isLoading, refetch, isFetching } = useUsers();
  const multipleUsers = useMultipleUsers(["1", "2", "3"]);

  // if (isLoading) return <p>Loading...</p>;
  // if (error) return <p>Error: {error.message}</p>;

  // if (multipleUsers.some((query: any) => query.isLoading))
  //   return <p>Loading...</p>;

  return (
    <div>
      <Link
        className="text-blue-500"
        to="/list"
        onMouseEnter={() => prefetchProducts(queryClient, 1)}
      >
        Open List
      </Link>
      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={() => addUserMutation({ name: "John Doe" })}
      >
        Add User
      </button>
      {/* <ul className="list-disc md-10">
        {multipleUsers.map((query: any) => (
          <li className="text-red-500" key={query.data?.id}>
            {query.data?.email}
          </li>
        ))}
      </ul> */}
      <ErrorBoundary
        onReset={queryErrorResetBoundary.reset} // reset error state when retry
        fallbackRender={({ resetErrorBoundary }) => (
          <div>
            <p>Something went wrong!</p>
            <button className="bg-emerald-500 text-white p-2 rounded-md" onClick={() => resetErrorBoundary()}>Try again</button>
          </div>
        )}
      >
        <Suspense fallback={<p>Suspend loading ...</p>}>
          <ListUser />
        </Suspense>
      </ErrorBoundary>
      {/* <ul>
        {data.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul> */}
    </div>
  );
};

const ListUser = () => {
  const { data } = useSuspenseQuery({
    queryKey: usersKeys.all,
    queryFn: fetchUsers,
  });
  return (
    <ul>
      {data.users?.map((user: any) => (
        <li key={user.id}>{user.email}</li>
      ))}
    </ul>
  );
};

export default Main;
