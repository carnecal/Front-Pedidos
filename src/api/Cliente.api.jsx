import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL
console.log("API URL:", API_URL);

export const ConsultarClientexCodigo= async ()=> 
    await axios.get(`${API_URL}/cliente/cod`)

export const ConsultarClientes= async ()=>
    await axios.get(`${API_URL}/cliente`)

export const ConsultarClientexId= async (id)=>
    await axios.get(`${API_URL}/client/${id}`)

export const CrearCliente= async (Cliente)=>
    await axios.post(`${API_URL}/cliente`,Cliente)

