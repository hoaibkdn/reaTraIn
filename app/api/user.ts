import { apiClient } from ".";

async function fetchUsers() {
  const { data } = await apiClient.get(`/users`);
  return data;
}

async function fetchUserDetails(id: string) {
  const { data } = await apiClient.get(`/users/${id}`);
  return data;
}

async function addUser(data: any) {
  const { data: response } = await apiClient.post(`/users`, data);
  return response;
}

export { fetchUsers, fetchUserDetails, addUser };