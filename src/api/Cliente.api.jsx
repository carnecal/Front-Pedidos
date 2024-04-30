import axios from "axios";
const apiUrl = "https://api-pedidos-rgwh.onrender.com"
console.log("API URL:", apiUrl);

export const ConsultarClientexCodigo= async ()=>
    await axios.get(`https://api-pedidos-rgwh.onrender.com/cliente/cod`)

export const CrearPedidoRequest= async (cliente)=>
    await axios.post(`https://api-pedidos-rgwh.onrender.com/cliente`, cliente)

export const ConsultarClientes= async ()=>
    await axios.get(`https://api-pedidos-rgwh.onrender.com/cliente`)

export const ConsultarClientexId= async (id)=>
    await axios.get(`https://api-pedidos-rgwh.onrender.com/client/${id}`)

