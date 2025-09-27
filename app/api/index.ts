import axios from "axios";

const BASE_URL = "https://jsonplaceholder.typicode.com";
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


const apiObject = axios.create({
  baseURL: "https://api.restful-api.dev/",
  headers: {
    "Content-Type": "application/json",
  },
});

export { apiClient, apiObject };
