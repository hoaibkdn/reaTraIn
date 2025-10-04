import { apiProducts } from ".";

const fetchProducts = async (limit: number) => {
    const { data } = await apiProducts.get(`/products?limit=${limit}`);
    return data;
}

export { fetchProducts };