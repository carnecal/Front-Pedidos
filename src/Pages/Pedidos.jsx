import CrearPedido from "../components/CrearPedido"
import CrearPedidoAlterno from "../components/CrearPedidoAlterno"
import NotificationBell from "../components/NotificacionBell"



function Pedidos() {
  return (
    <div>
      <NotificationBell/>
      <CrearPedidoAlterno/>
    </div>

  )
}

export default Pedidos