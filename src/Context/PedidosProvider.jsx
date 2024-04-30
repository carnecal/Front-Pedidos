import { createContext, useContext, useState } from "react";
import { ConsultarClientes } from "../api/Cliente.api";
import { PedidosContext } from "./PedidosContext";
import { ConsultarPedidoRequest, ConsultarPedidoxIdRequest, CrearPedidoRequest, EditarPedidoRequest } from "../api/Pedido.api";
import { ConsultarEmpleadoRequest } from "../api/Empleados.api";
import { ConsultarProductosRequest } from "../api/Productos.api";
import moment from 'moment-timezone';
const apiUrl = import.meta.env.REACT_APP_API_URL;



export const usePedidos=()=>{
   const context= useContext(PedidosContext)
   if(!context){
   throw new Error ("usePedidos debe ser usado entre TaskContextProvider")
}return context
}

export const PedidosContextProvider = ({ children }) => {

  /** estado Para los inputs */
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  /** Funciones de Crear pedido */
  async function cargarClientes() {
    const response = await ConsultarClientes();
    setClientes(response.data);
  }

  async function cargarProductos() {
    const response = await ConsultarProductosRequest();
    setProductos(response.data);
  }

  async function cargarEmpleados() {
    const response = await ConsultarEmpleadoRequest()
    setEmpleados(response.data);
  }
  /** Funciones de Listar Pedido */
  const [pedidos, setPedidos]=useState([])
  

  const crearPedido = async (pedido)=>{
    try {
      const respuesta = await CrearPedidoRequest(pedido);
      setPedidos([...pedidos, respuesta.data])
      // Limpia los estados de los campos del formulario después de enviar los datos
      
    } catch (error) {
      console.log(error);
    }
  }

  /** Funciones Editar pedido */
  const editarPedido = async (id, pedido)=>{
    try {
      const respuesta = await EditarPedidoRequest(id,pedido);
      setPedidos([...pedidos, respuesta.data])
      // Limpia los estados de los campos del formulario después de enviar los datos
      
    } catch (error) {
      console.log(error);
    }
  }

  /**Funciones de PedidoCard */
  

  async function cargarPedido() {
    const response= await ConsultarPedidoRequest()
    setPedidos(response.data)
   //setPedidos(pedidos.filter( p => p.Estado ==false))
  }

  async function handleRefresh(){
    setPedidos(pedidos.filter(p => p.Estado == false))
    
  }
  const handleEmpacado = async (id, pedido1) => {
    console.log("Empacado");
    try {
      const horaActual = moment.tz(Date.now(),"America/Bogota").format('YYYY-MM-DD h:mm:ss  A')
  
      const datosActualizados = {
        ...pedido1,
        Hora_Despacho: horaActual,
        Estado: true,
      };
  
      const response = await EditarPedidoRequest(id, datosActualizados);
      setPedidos(pedidos.filter(p => p.Estado === false));
    } catch (error) {
      console.log(error);
    }
  };

  /** Funciones generales */
  

  return (
  <PedidosContext.Provider value={
    {/** Crear Pedido */
      clientes,productos,empleados, crearPedido, cargarClientes,cargarProductos,cargarEmpleados,
      /** Listar Pedidos */
      pedidos,cargarPedido,
      /** CardPedidos */
      handleEmpacado, handleRefresh,
      /**Editar Pedido */
      editarPedido
          }}>
    {children}
    </PedidosContext.Provider>
    );
};
