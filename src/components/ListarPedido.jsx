import { useEffect, useState } from "react";
import { ConsultarPedidoRequest } from "../api/Pedido.api";
import PedidoCard from "./PedidoCard";
import { usePedidos } from "../Context/PedidosProvider";

function ListarPedido() {
  const { cargarPedido, pedidos } = usePedidos();

  useEffect(() => {
    cargarPedido();
  }, []);

  
  
  return (
    <>
      <h1 className="text-2xl text-white font-bold text-center py-4">
        Pedidos en Proceso
      </h1>
      <div className="grid grid-cols-2 gap-2">
        {pedidos.map((pedido) => (
          <PedidoCard pedido={pedido} key={pedido.id} />
        ))}
      </div>
    </>
  );
}

export default ListarPedido;
