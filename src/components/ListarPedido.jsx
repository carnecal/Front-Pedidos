import { useEffect, useState } from "react";
import { ConsultarPedidoRequest } from "../api/Pedido.api";
import PedidoCard from "./PedidoCard";
import { usePedidos } from "../Context/PedidosProvider";

function ListarPedido() {
  const { cargarPedido, pedidos } = usePedidos();

  useEffect(() => {
    cargarPedido();
  }, [cargarPedido]);

  const [intervalId, setIntervalId] = useState(null); // Estado para almacenar el ID del intervalo

  useEffect(() => {
    // Función que se ejecutará cada cierto tiempo
    const fetchData = () => {
      cargarPedido();
    };

    // Establecer el intervalo de actualización (en milisegundos)
    const interval = setInterval(fetchData, 5000); // Cada 5 segundos

    // Guardar el ID del intervalo en el estado
    setIntervalId(interval);

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []); // El arreglo vacío asegura que el efecto solo se ejecute una vez


  
  
  return (
    <>
      <h1 className="text-2xl text-white font-bold text-center py-4">
        Pedidos en Proceso
      </h1>
      <div className="grid grid-cols-2 gap-2">
      {(pedidos && pedidos.length > 0) ? (
  pedidos.map((pedido) => <PedidoCard pedido={pedido} key={pedido.id} />)
) : (
  <p>No hay pedidos disponibles</p>
)}
      </div>
    </>
  );
}

export default ListarPedido;
