import axios from "axios";
const API_URL = import.meta.env.REACT_APP_API_URL;


export const CrearProductoRequest= async (producto)=>
    await axios.post(`${API_URL}/producto`, producto)

export const ConsultarProductosRequest= async ()=>
    await axios.get(`${API_URL}/producto`)