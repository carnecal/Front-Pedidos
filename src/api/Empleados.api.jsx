import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL


export const CrearEmpleadoRequest= async (empleado)=>
    await axios.post(`${API_URL}/empleado`, empleado)

export const ConsultarEmpleadoRequest= async ()=>
    await axios.get(`${API_URL}/empleado`)