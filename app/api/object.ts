import { apiObject } from ".";

async function fetchObject() {
    const { data } = await apiObject.get(`/objects`);
    return data;
}

async function addObject(data: any) {
    const { data: response } = await apiObject.post(`/objects`, data);
    return response;
}

export { fetchObject, addObject };