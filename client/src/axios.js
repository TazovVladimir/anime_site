import axios from "axios";

window.axios = axios
axios.defaults.withCredentials = false
axios.defaults.baseURL = "http://localhost:4000"
// let backendUrl = "http://" + window.location.hostname.toString() + ":4000"
// axios.defaults.baseURL = backendUrl
