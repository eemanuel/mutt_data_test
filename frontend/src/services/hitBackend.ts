import axios from "axios";

const hitBackend = axios.create({
  baseURL: "http://localhost:8000/api",
});

export default hitBackend;
