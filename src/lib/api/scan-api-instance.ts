import axios from "axios";

export const scanApiInstance = axios.create({
    baseURL: "https://somnia-poc.w3us.site/api/v2",
});


