import axios from "axios"


const serverURL = process.env.REACT_APP_SERVER_URL

const API = axios.create({baseURL: serverURL});

export const signup = (data) => API.post('/api/auth/signup', data);
export const login = (data) => API.post('/api/auth/login', data);