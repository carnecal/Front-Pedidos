import { createContext, useContext, useEffect, useState } from "react";
import { ConsultarClientes, CrearCliente } from "../api/Cliente.api";
import { PedidosContext } from "./PedidosContext";
import { ConsultarPedidoRequest, ConsultarPedidoxIdRequest, ConsultarTodosPedidos, CrearPedidoRequest, EditarPedidoRequest } from "../api/Pedido.api";
import { ConsultarEmpleadoRequest } from "../api/Empleados.api";
import { ConsultarProductosRequest} from "../api/Productos.api";
import * as moment from "moment-timezone";
import { useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
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
  const cargarClientes = useCallback(async () => {
    const response = await ConsultarClientes();
    setClientes(response.data);
  }, []);

  const cargarProductos = useCallback(async () => {
    const response = await ConsultarProductosRequest();
    setProductos(response.data);
  }, []);

  const cargarEmpleados = useCallback(async () => {
    const response = await ConsultarEmpleadoRequest();
    setEmpleados(response.data);
  }, []);
  /** Funciones de Listar Pedido */
  const [pedidos, setPedidos]=useState([])
  

  const crearPedido = useCallback(async (pedido) => {
    try {
      const respuesta = await CrearPedidoRequest(pedido);
      setPedidos([...pedidos, respuesta.data]);
    } catch (error) {
      console.log(error);
    }
  }, [pedidos]);

  const crearCliente = useCallback(async (cliente) => {
    try {
      const respuesta = await CrearCliente(cliente);
      return respuesta.data;
    } catch (error) {
      console.log(error);
    }
  }, []);


  /** Funciones Editar pedido */
  const editarPedido = useCallback(async (id, pedido) => {
    try {
      const respuesta = await EditarPedidoRequest(id, pedido);
      setPedidos([...pedidos, respuesta.data]);
      console.log(respuesta.data)
    } catch (error) {
      console.log(error);
    }
  }, [pedidos]);

  /**Funciones de PedidoCard */
  
/**CARGAR PEDIDOS */
  const cargarPedido = useCallback(async () => {
    const response = await ConsultarPedidoRequest();
    setPedidos(response.data);
  }, []);

  const [pedidosTodos, setPedidosTodos] = useState([]);

  const cargarTodosPedidos = useCallback(async () => {
    const response = await ConsultarTodosPedidos();
    setPedidosTodos(response.data);
  }, []);

;

  const navigate = useNavigate();

  const handleRefresh = useCallback(() => {
    navigate('/PedidosCola')
  }, []);

  const handleEmpacado = useCallback(async (id, pedido1) => {
    console.log("Empacado");
    const horaActual = moment.tz(Date.now(), "America/Bogota").format('YYYY-MM-DD h:mm:ss A');
    try {
        const datosActualizados = { ...pedido1, Hora_Despacho: horaActual, Estado: true };
        editarPedido(id, datosActualizados)
          } catch (error) {
      console.log(error);
    }
  }, [pedidos]);


  /** Funciones generales */
  

  return (
  <PedidosContext.Provider value={
    {/** Crear Pedido */
      clientes,productos,empleados, crearPedido, cargarClientes,cargarProductos,cargarEmpleados,
      crearCliente,cargarClientes,
      /** Listar Pedidos */
      pedidos,cargarPedido,cargarTodosPedidos, pedidosTodos,
      /** CardPedidos */
      handleEmpacado, handleRefresh,
      /**Editar Pedido */
      editarPedido
          }}>
    {children}
    </PedidosContext.Provider>
    );
};
