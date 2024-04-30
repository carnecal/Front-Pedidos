import axios from "axios";
const apiUrl = import.meta.env.REACT_APP_API_URL;


export const CrearEmpleadoRequest= async (empleado)=>
    await axios.post(`https://api-pedidos-rgwh.onrender.com/empleado`, empleado)

export const ConsultarEmpleadoRequest= async ()=>
    await axios.get(`https://api-pedidos-rgwh.onrender.com/empleado`)