import axios from "axios";
const apiUrl = import.meta.env.REACT_APP_API_URL;

export const CrearProductoRequest= async (producto)=>
    await axios.post(`https://api-pedidos-rgwh.onrender.com/producto`, producto)

export const ConsultarProductosRequest= async ()=>
    await axios.get(`https://api-pedidos-rgwh.onrender.com/producto`)