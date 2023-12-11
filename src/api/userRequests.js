import axios from "axios"


const serverURL = process.env.REACT_APP_SERVER_URL

const API = axios.create({baseURL: serverURL});

export const getAllUsers = () => API.get('/api/user');

export const getUser = (id) => API.get(`/api/user/${id}`);

export const updateUser = (id, data) => {
    const token = localStorage.getItem('access_token')
    return API.put(`/api/user/${id}`, data, {headers: {token}})
};

export const deleteUser = (id) => {
    const token = localStorage.getItem('access_token')
    return API.delete(`/api/user/${id}`, {headers: {token}})
};