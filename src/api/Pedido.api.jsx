import axios from "axios";
const API_URL = import.meta.env.REACT_APP_API_URL;


export const ConsultarPedidoRequest= async ()=>
    await axios.get(`${API_URL}/pedido`)

export const CrearPedidoRequest= async (Pedido)=>
    await axios.post(`${API_URL}/pedido`, Pedido)

export const ConsultarPedidoxIdRequest= async (id)=>
    await axios.get(`${API_URL}/pedido/unique/${id}`)

export const EditarPedidoRequest= async (id, datos)=>
    await axios.patch(`${API_URL}/pedido/${id}`,datos)

export const ConsultarTodosPedidos= async ()=>
    await axios.get(`${API_URL}/pedido/All`)