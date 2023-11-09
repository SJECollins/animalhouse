import axios from "axios";

let access_token = "";

if (document.cookie.includes("access_token")) {
  access_token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("access_token"))
    .split("=")[1];
}

axios.defaults.baseURL = "/api";
axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

export const axiosReq = axios.create();
export const axiosRes = axios.create();
