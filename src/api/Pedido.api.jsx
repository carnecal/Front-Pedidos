import axios from "axios";
const apiUrl = import.meta.env.REACT_APP_API_URL;

export const ConsultarPedidoRequest= async ()=>
    await axios.get(`https://api-pedidos-rgwh.onrender.com/pedido`)

export const CrearPedidoRequest= async (Pedido)=>
    await axios.post(`https://api-pedidos-rgwh.onrender.com/pedido`, Pedido)

export const ConsultarPedidoxIdRequest= async (id)=>
    await axios.get(`https://api-pedidos-rgwh.onrender.com/pedido/unique/${id}`)

export const EditarPedidoRequest= async (id, datos)=>
    await axios.patch(`https://api-pedidos-rgwh.onrender.com/pedido/${id}`,datos)