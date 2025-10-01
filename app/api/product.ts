import { apiProducts } from ".";

const fetchProducts = async (limit: number, skip: number = 0) => {
    const { data } = await apiProducts.get(`/products?limit=${limit}&skip=${skip}`);
    return data;
}

export { fetchProducts };