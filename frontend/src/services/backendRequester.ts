import axios from "axios";

const backendRequester = axios.create({
  baseURL: "http://localhost:8000/api",
});

export default backendRequester;
