import { apiClient } from ".";

async function fetchUsers() {
  const { data } = await apiClient.get(`/users?limit=2000`);
  return data;
}

async function fetchUserDetails(id: string) {
  const { data } = await apiClient.get(`/users/${id}`);
  return data;
}

async function addUser(user: any) {
  const { data } = await apiClient.post(`/users`, user);
  return data;
}

export { fetchUsers, fetchUserDetails, addUser };