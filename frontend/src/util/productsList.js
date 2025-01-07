import axios from "axios";

export const fetchCoinBaseProductsList = () => {
    return axios.get(`/api/products-list`);
};