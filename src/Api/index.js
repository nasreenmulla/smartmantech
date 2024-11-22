import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/",
  //8000
  //1521
});


export default API;