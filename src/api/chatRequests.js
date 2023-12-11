import axios from "axios"


const serverURL = process.env.REACT_APP_SERVER_URL

const API = axios.create({baseURL: serverURL});

export const userChats = () => {
    const token = localStorage.getItem('access_token')
    return API.get('/api/chat', {headers: {token}})
};

export const findChat = (firstId, secondId) => {
    const token = localStorage.getItem('access_token')
    return API.get(`/api/chat/${firstId}/${secondId}`, {headers: {token}})
};

export const deleteChat = (chatId) => {
    const token = localStorage.getItem('access_token')
    return API.delete(`/api/chat/${chatId}`, {headers: {token}})
};