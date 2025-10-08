import { apiProducts } from ".";

const fetchProducts = async (offset: number = 0, limit: number = 20) => {
    const { data } = await apiProducts.get(`/products?skip=${offset}&limit=${limit}`);
    return data;
}

export { fetchProducts };