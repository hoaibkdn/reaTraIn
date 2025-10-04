import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useMultipleUsers, useUsers, useAddUser } from "~/hooks/useUsers";

const Main = () => {
  const queryClient = useQueryClient();
  const { data, error, isLoading, refetch, isFetching } = useUsers();
  const { mutate: addUser } = useAddUser();
  console.log("isLoading ", isLoading);
  console.log("isFetching ", isFetching);
//   const multipleUsers = useMultipleUsers(["1", "3", "5", "7", "8"]); // ["1", "3", "5", "7", "8"]
//   console.log("multipleUsers ", multipleUsers);

  useEffect(() => {
    return () => {
      queryClient.cancelQueries();
    };
  }, []);

//   if (multipleUsers.some((query: any) => query.isLoading)) {
//     return <p>Loading...</p>;
//   }

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {/* {multipleUsers.map((query: any) => (
        <li className="text-red-500" key={query.data.id}>
          {query.data.email} {query.data.phone}
        </li>
      ))} */}
      <button className="bg-blue-500 text-white p-2 rounded-md" onClick={() => addUser({ firstName: "Sydexa", lastName: "Doe" })}>
        Add User
      </button>
      <ul>
        {" "}
        {data?.users?.map((user: any) => (
          <li key={user.id}>
            {user.firstName} {user.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Main;
