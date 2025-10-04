import { apiClient, apiProducts } from ".";

async function fetchUsers({ signal }: { signal: AbortSignal }) {
  console.log("fetchUsers signal ", signal);
  // await new Promise(r => setTimeout(r, 2000));
  const { data } = await apiProducts.get(`/users12?limit=2000`);
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
