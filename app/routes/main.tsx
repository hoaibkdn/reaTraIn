import { useQuery } from "@tanstack/react-query";
import { addUser, fetchUsers } from "../api/user";
import { Link } from "react-router";
import { useUsers, useAddUser, useMultipleUsers } from "../hooks/useUsers";

const Main = () => {
  const { data, error, isLoading } = useUsers();
  const { mutate: addUserMutation } = useAddUser();
  const multipleUsers = useMultipleUsers(["1", "2", "3"]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (multipleUsers.some((query: any) => query.isLoading)) return <p>Loading...</p>;

  return (
    <div>
      <Link className="text-blue-500" to="/list">
        Open List
      </Link>
      <button
        className="bg-blue-500 text-white p-2 rounded-md"
        onClick={() => addUserMutation({ name: "John Doe" })}
      >
        Add User
      </button>
      <ul className="list-disc md-10">
      {multipleUsers.map((query: any) => (
        <li className="text-red-500" key={query.data?.id}>{query.data?.email}</li>
      ))}

      </ul>
      <ul>
        {data.map((user: any) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Main;